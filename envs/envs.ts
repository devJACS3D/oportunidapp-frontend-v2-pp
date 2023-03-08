const configFileEnv = (env: any) => {
  const environment =
    env.NODE_ENV === "production" && env.PRODUCTION === true ? ".prod" : "";
  const pathEnvironments = `./src/environments/environment${environment}.ts`;
  const environments = `export const environment = {
    nodeEnv: '${env.NODE_ENV}',
    production: ${env.PRODUCTION}, 
    apiVersion: '${env.APIVERSION}', 
    apiHost: '${env.APIHOST}',
    apiEvalHost: '${env.APIEVALHOST}',
    apiEmpHost: '${env.APIEMPHOST}',
    usagePolicies: '${env.USAGE_POLICIES}',
    termsAndConditions: '${env.TERMS_AND_CONDITIONS}', 
    ytIdPreInterviews: '${env.YT_ID_PREINTERVIEWS}',
    socketApplymentStatus: '${env.SOCKET_APPLYMENT_STATUS}'
}`;
  return { environments, pathEnvironments };
};

export { configFileEnv };
