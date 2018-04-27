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
  let testCasesIn, testCasesOut
  console.log('this is req.body.tests', req.body.tests);
  if (req.body.tests.length > 1) {
    console.log('this works for strings');
    testCasesIn = req.body.tests.slice(0, req.body.tests.length / 2);
    testCasesOut = req.body.tests.slice(req.body.tests.length / 2);
  } else if (req.body.tests.length === 1) {
    console.log('trying to make this work for numbers');
    testCasesIn = req.body.tests[0].split(',').slice(0, req.body.tests[0].split(',').length / 2);
    testCasesOut = req.body.tests[0].split(',').slice(req.body.tests[0].split(',').length / 2);
  }
  console.log('this is testCasesIn', testCasesIn)
  console.log('this is testCasesOut', testCasesOut)
  console.log('this is testCasesIn for numbers', `(${testCasesIn[i]})`)
  console.log('this is testCasesOut', testCasesOut)
  const { code } = req.body;
  function recurse(cb) {
    s.run(code.concat(code.split('function ').join('').split('(')[0].concat(
          typeof parseInt(testCasesIn[i]) === 'number' 
        ?
          `(${testCasesIn[i]})`
        :  
          typeof testCasesIn[i] === 'string' 
        ? 
          `("${testCasesIn[i].split('\\').join('').split(' ').join('')}")`
        : 
          'array'
        )), (output) => {
      if (output.result.split('\\').join('').split(' ').join('') !== `'${testCasesOut[i].split('\\').join('').split(' ').join('')}'`) {
        output.win = false;
        cb(output, ++i);
        return;
      } else if (output.result.split('\\').join('').split(' ').join('') === `'${testCasesOut[i].split('\\').join('').split(' ').join('')}'`) {
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
