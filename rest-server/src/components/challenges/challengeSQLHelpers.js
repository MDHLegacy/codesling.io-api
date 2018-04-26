export const addChallengeHelper = `
  INSERT INTO 
    challenges (title, content, difficulty, rating)
  VALUES 
    ($1, $2, $3, 0)
  RETURNING 
    id, title, content, difficulty
`;

export const fetchChallengeHelper = `
  SELECT
    c.id, c.title, c.content, c.difficulty, c.rating, tc.data, tc.challenge_id
  FROM
    challenges AS c
  FULL OUTER JOIN
    testCases AS tc
  ON
    (c.id=tc.challenge_id)
`;
