import { createApp } from '../application'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)
chai.should()

describe('logging service', () => {
    const testApp = createApp()
    it('should return 200 from healthcheck', done => {
        chai.request(testApp)
            .get('/healthcheck')
            .end((err, res) => {
                expect(res.status).toBe(200)
                done()
            })
    })
})
