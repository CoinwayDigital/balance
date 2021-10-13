import db from '@src/infra'

test('it should be ok', () => {
  const dbResponse = db()
  expect(dbResponse).toEqual('Status Connection')
})
