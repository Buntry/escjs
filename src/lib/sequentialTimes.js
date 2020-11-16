import _ from 'lodash'

export default async (limit, promiseGenerator) => 
  _.times(limit).reduce((promise, cur) => promise.then(() => promiseGenerator(cur)), Promise.resolve())