.PHONY: all clean fclean re purge-db purge-all help

all:
	docker compose up --build

clean:
	docker compose down

fclean:
	docker compose down --rmi all --volumes --remove-orphans

purge-db:
	docker compose down
	docker volume rm $$(docker volume ls -q | grep postgres-data) 2>/dev/null || true

purge-all: fclean
	docker system prune -a -f --volumes
	docker network prune -f
	docker volume prune -f

re: fclean all