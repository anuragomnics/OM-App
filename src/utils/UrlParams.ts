export const generateParams = (
  requestParams = {},
  matchingParams: Array<string> = [],
) => {
  const params = {};
  matchingParams.map(matchingParam => {
    if (requestParams.hasOwnProperty(matchingParam)) {
      // @ts-ignore
      params[matchingParam] = requestParams[matchingParam];
    }
  });
  return params;
};
