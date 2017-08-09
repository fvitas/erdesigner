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

    generateTables(nodes, connections) {
        // generate tables from nodes
        let tables = _(nodes)
            .filter(node => _.includes([NODE_TYPES.ENTITY, NODE_TYPES.WEAK_ENTITY], node.type))
            .map(node => {
                return {
                    nodeId: node.nodeId,
                    name: _.camelCase(node.nodeName),
                    type: node.type,
                    attributes: []
                }
            })
            .value()

        // generate attributes for every table
        _.forEach(tables, function(table) {
            table.attributes = _(connections)
                .filter(connection => connection.source.nodeId === table.nodeId || connection.destination.nodeId === table.nodeId)
                .map(connection => {
                    let attribute

                    if (connection.source.nodeId !== table.nodeId) {
                        // attribute is source
                        attribute = _.find(nodes, node => node.nodeId === connection.source.nodeId)
                    } else {
                        // attribute is destination
                        attribute = _.find(nodes, node => node.nodeId === connection.destination.nodeId)
                    }

                    if (attribute.type !== NODE_TYPES.ATTRIBUTE) {
                        return
                    }

                    return {
                        name: attribute.nodeName,
                        type: 'VARCHAR',
                        nullable: false,
                        unique: false,
                        autoIncrement: false
                    }
                })
                .filter(attribute => !!attribute)
                .value()
        })

        // TODO filipv: generate SQL for all cases
        // add tables that are represented with
        // NODE_TYPES.RELATIONSHIP, NODE_TYPES.ASSOCIATIVE_ENTITY

        // add / propagate all attributes from parent to children of inheritance and delete parent ???

        return tables
    }

    generateSQLText(tables) {
        if (_.isEmpty(tables)) {
            return ''
        }

        let sqlText = ''

        _.forEach(tables, function(table, tableIndex, c) {
            console.log(table, tableIndex, c)
            if (tableIndex !== 0) {
                sqlText += '\n'
            }

            sqlText += 'CREATE TABLE `' + table.name + '` (\n'

            _.forEach(table.attributes, function(attribute, attributeIndex) {
                sqlText += '  ' + '`' + attribute.name + '` ' + attribute.type + ' '

                if (attribute.nullable) {
                    sqlText += 'NULL'
                } else {
                    sqlText += 'NOT NULL'
                }

                if (attribute.unique) {
                    sqlText += ' ' + 'UNIQUE'
                }

                if (attribute.autoIncrement) {
                    sqlText += ' ' + 'AUTO_INCREMENT'
                }

                if (attributeIndex !== table.attributes.length - 1) {
                    sqlText += ','
                }

                sqlText += '\n'
            })

            sqlText += ');\n'
        })

        return sqlText
    }
}

const sqlGenerator = new SQLGenerator()

export default sqlGenerator
