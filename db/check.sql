-- we want total number of comments that have article Id that is passed in by the request 

\c nc_news_test




-- SELECT COUNT (comments.comment_id) AS comment_count FROM comments WHERE comments.article_id = 1;

SELECT articles.article_id, articles.title, COUNT(comments.comment_id) FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = 1
GROUP BY articles.article_id;