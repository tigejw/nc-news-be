\c nc_news_test;

SELECT title, 
articles.author, 
articles.article_id, 
topic, 
articles.created_at,
articles.votes,
article_img_url,
COUNT(comments.comment_id) AS comment_count
FROM articles 
LEFT JOIN comments
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;

-- SELECT * FROM comments ORDER BY created_at DESC;

-- Description

-- Should:

--     be available on /api/articles/:article_id.
--     update an article by article_id.

-- Request body accepts:

--     an object in the form { inc_votes: newVote }.
--     newVote will indicate how much the votes property in the database should be updated by, e.g.
--         { inc_votes : 1 } would increment the current article's vote property by 1
--         { inc_votes : -100 } would decrement the current article's vote property by 100

-- Responds with:

--     the updated article

-- Consider what errors could occur with this endpoint, and make sure to test for them.

-- Remember to add a description of this endpoint to your /api endpoint.

-- PATCH/PUT by ID

--     Attempting to PATCH a resource with a body that does not contain the correct fields 
-- (e.g. /api/resource/:id with a body of {}): 400 Bad Request
--     Attempting to PATCH a resource with valid body fields but invalid fields 
-- (e.g /api/resource/:id with a body of { increase_votes_by: "word" }): 400 Bad Request