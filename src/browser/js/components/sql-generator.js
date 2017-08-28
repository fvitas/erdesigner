import _ from 'lodash'
import NODE_TYPES from '../constants/node-type'
import nodeStore from '../redux/store'

class SQLGenerator {
    generateSQL() {
        let nodes = nodeStore.getState().nodes
        let connections = nodeStore.getState().connections

        let tables = this.generateTables(nodes, connections)
        let sqlText = this.generateSQLText(tables)

        return sqlText
    }

    generateTables(stateNodes, stateConnections) {
        let nodes = _.cloneDeep(stateNodes)
        let connections = _.cloneDeep(stateConnections)

        // generate tables from nodes
        let tables = _(nodes)
            .filter(node => _.includes([NODE_TYPES.ENTITY, NODE_TYPES.RELATIONSHIP, NODE_TYPES.WEAK_ENTITY], node.type))
            .map(node => {
                return {
                    nodeId: node.nodeId,
                    name: _.camelCase(node.nodeName),
                    type: node.type,
                    attributes: node.attributes
                }
            })
            .value()

        // NODE_TYPES.INHERITANCE
        let inheritanceNodes = _.filter(tables, { type: NODE_TYPES.INHERITANCE })

        _.forEach(inheritanceNodes, inheritance => {
            if (!inheritance.parent) {
                return
            }

            let parentNode = _.find(tables, { nodeId: inheritance.parent })

            let children = _(connections)
                .filter(connection => {
                    return (inheritance.nodeId === connection.source.nodeId || inheritance.nodeId === connection.destination.nodeId) &&
                           (connection.source.nodeId !== parentNode.nodeId && connection.destination.nodeId !== parentNode.nodeId)
                })
                .map(connection => _.find(tables, { nodeId: connection.source.nodeId !== inheritance.nodeId ? connection.source.nodeId : connection.destination.nodeId }))
                .value()

            _.forEach(children, child => {
                child.attributes.push(...parentNode.attributes)
            })

            _.remove(tables, { nodeId: parentNode.nodeId })
        })

        // NODE_TYPES.RELATIONSHIP
        let relationshipNodes = _.filter(tables, { type: NODE_TYPES.RELATIONSHIP })

        _.forEach(relationshipNodes, relationship => {
            let connectedNodes = _(connections)
                .filter(connection => connection.source.nodeId === relationship.nodeId || connection.destination.nodeId === relationship.nodeId)
                .map(connection => _.find(tables, { nodeId: connection.source.nodeId !== relationship.nodeId ? connection.source.nodeId : connection.destination.nodeId }))
                .value()

            relationship.foreignKeys = _.flatMap(connectedNodes, node => {
                return _(node.attributes)
                    .filter({ isPrimary: true })
                    .map(attribute => {
                        return {
                            name: attribute.name,
                            reference: node.name,
                            type: attribute.type
                        }
                    })
                    .value()
            })
        })

        // TODO filipv: generate SQL for all cases
        // add tables that are represented with
        // , NODE_TYPES.ASSOCIATIVE_ENTITY

        return tables
    }

    generateSQLText(tables) {
        if (_.isEmpty(tables)) {
            return ''
        }

        let sqlText = ''

        _.forEach(tables, function(table, tableIndex) {
            if (tableIndex !== 0) {
                sqlText += '\n'
            }

            sqlText += 'CREATE TABLE `' + table.name + '` (\n'

            _.forEach(table.attributes, function(attribute) {
                sqlText += '  `' + attribute.name + '` ' + attribute.type

                // if (attribute.nullable) {
                //     sqlText += 'NULL'
                // } else {
                //     sqlText += 'NOT NULL'
                // }
                //
                // if (attribute.unique) {
                //     sqlText += ' ' + 'UNIQUE'
                // }
                //
                // if (attribute.autoIncrement) {
                //     sqlText += ' ' + 'AUTO_INCREMENT'
                // }

                if (attribute.isPrimary) {
                    sqlText += ' NOT NULL'
                }

                sqlText += ',\n'
            })

            if (table.foreignKeys && !_.isEmpty(table.foreignKeys)) {
                _.forEach(table.foreignKeys, key => {
                    sqlText += '  `' + key.name + '` ' + key.type + ' NOT NULL,\n'
                })

                sqlText += `  PRIMARY KEY (${_.join(table.foreignKeys.map(x => x.name), ', ')}),\n`

                let references = _.groupBy(table.foreignKeys, 'reference')

                _.forEach(references, (keys, reference) => {
                    sqlText += `  FOREIGN KEY (${_.join(keys.map(x => x.name), ', ')}) REFERENCES ${reference}(${_.join(keys.map(x => x.name), ', ')}),\n`
                })
            } else {
                let primaryKeys = _.filter(table.attributes, { isPrimary: true })

                if (!_.isEmpty(primaryKeys)) {
                    sqlText += `  PRIMARY KEY (${_.join(primaryKeys.map(x => x.name), ', ')}),\n`
                }
            }

            sqlText = _.trimEnd(sqlText, ',\n')

            sqlText += '\n);\n'
        })

        return sqlText
    }
}

const sqlGenerator = new SQLGenerator()

export default sqlGenerator
