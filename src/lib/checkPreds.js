import _ from 'lodash'

export default (predicateMessages) => _.findKey(predicateMessages, pm => !pm)
