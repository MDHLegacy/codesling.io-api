export const addTestCaseHelper = `
  INSERT INTO 
    testCases (data, challenge_id)
  VALUES 
    ($1, $2)
  RETURNING
    id, data, challenge_id
`;

// throw this shit into the challenge fetch
export const fetchAllTestCasesHelper = ({ challenge_id }) => {
  return `
    SELECT
      id, data, challenge_id
    FROM
      testCases
    WHERE
      challenge_id=${challenge_id}
  `;
};
