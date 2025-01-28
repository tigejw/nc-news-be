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


--     an array of comments for the given article_id of which each comment should have the following properties:
--         comment_id
--         votes
--         created_at
--         author
--         body
--         article_id

-- Comments should be served with the most recent comments first.