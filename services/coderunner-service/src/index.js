import Sandbox from 'sandbox';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bluebird from 'bluebird';


import { success } from './lib/log';

const app = express();
const s = new Sandbox();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());


app.post('/submit-code', async (req, res) => {
  let i = 0;
  let store = [];
  const testCasesIn = req.body.tests.slice(0, req.body.tests.length / 2);
  const testCasesOut = req.body.tests.slice(req.body.tests.length / 2);
  console.log('this is the req.body', req.body)
  const { code } = req.body;
  function recurse(cb) {
    s.run(code.concat(code.split('function ').join('').split('(')[0].concat(`(${testCasesIn[i]})`)), (output) => {
      if (output.result !== testCasesOut[i]) {
        output.win = false;
        cb(output, ++i);
        return;
      } else if (output.result === testCasesOut[i]) {
        output.win = true;
        cb(output, ++i);
      }
      if (i > testCasesOut.length) {
        return;
      }
    });
  }
  const innerFunc = (output, x) => {
    store.push(output.win);
    if (x === testCasesOut.length) {
      output.win = store;
      console.log('this is returned to the client', output);
      res.status(200).send(output);
    } else {
      recurse(innerFunc);
    }
  };
  recurse(innerFunc);
});


app.listen(PORT, success(`coderunner-service is listening on port ${PORT}`));
