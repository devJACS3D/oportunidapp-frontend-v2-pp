const writeFile = require('fs').writeFile
const dotenv = require('dotenv');
// Load node modules
const colors = require('colors');
/* -------------------------------------------------------------------------- */
/* get .env file name*/
/* -------------------------------------------------------------------------- */
const fs = require('fs');
let nameEnv = '.env.development'
try {
  const files = fs.readdirSync(__dirname);
  nameEnv = files.length && files.filter((file: any) => file.includes('.env'))[0];
} catch (error) {
  console.error(error);
}
/* -------------------------------------------------------------------------- */
/* assign the name of the .env file and parse the data types of the variables*/
/* -------------------------------------------------------------------------- */
dotenv.config({ path: nameEnv });
/* -------------------------------------------------------------------------- */
/* Configure Angular `environment.ts` file path*/
/* -------------------------------------------------------------------------- */
import { configFileEnv } from "./envs/envs";
const { environments, pathEnvironments } = configFileEnv(process.env);
/* ----------------------------------------------------------------------------------------------------- */
/* create the data from the angular environment file */
/* ----------------------------------------------------------------------------------------------------- */
console.log(colors.cyan('THE FILE `environment.ts` WILL BE WRITTEN WITH THE FOLLOWING CONTENT: \n'));
console.log(colors.yellow(environments));
writeFile(pathEnvironments, environments, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(colors.green(`ANGULAR environment.ts FILE GENERATED CORRECTLY AT ${pathEnvironments} \n`));
  }
});


