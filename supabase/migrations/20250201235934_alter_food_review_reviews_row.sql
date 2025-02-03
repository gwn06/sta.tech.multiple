BEGIN;

ALTER TABLE food_review_reviews
DROP CONSTRAINT food_review_reviews_food_review_id_fkey;

ALTER TABLE food_review_reviews
ADD CONSTRAINT food_review_reviews_food_review_id_fkey
FOREIGN KEY (food_review_id)
REFERENCES food_review (id)
ON DELETE CASCADE;

COMMIT;
