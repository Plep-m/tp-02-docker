.PHONY: all clean fclean re purge

all:
	docker compose up --build

clean:
	docker compose down

fclean:
	docker compose down --rmi all --volumes --remove-orphans

purge: fclean
	rm -f ./db/app.db

re: purge all
