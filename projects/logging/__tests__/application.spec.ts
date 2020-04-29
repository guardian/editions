// import { Request, Response } from 'express'
// import { EditionsBackendControllers, createApp } from '../application'
// import chai from 'chai'
// import chaiHttp from 'chai-http'

// chai.use(chaiHttp)
// chai.should()

// const stub = (req: Request, res: Response) => {
//     console.log(`endpoint: ${req.path} called`)
//     res.sendStatus(200)
// }

// describe('log endpoint returns 200', () => {
//     const previewApp = createApp(testStubControllers, true)
//     it('should return 200 for valid post requests', done => {
//         chai.request(previewApp)
//             .post('/log')
//             .end((err, res) => {
//                 expect(res.status).toBe(200)
//                 done()
//             })
//     })
// })
