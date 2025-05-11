DELETE FROM "UserData"
WHERE "token" = $token
RETURNING *;