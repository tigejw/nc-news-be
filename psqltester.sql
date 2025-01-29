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

-- ttempting to DELETE a resource that does not exist 
-- (e.g. /api/resource/999999999): 404 Not Found
-- Attempting to DELETE a resource referenced by an invalid ID
-- (e.g. /api/resource/notAnId): 400 Bad Request