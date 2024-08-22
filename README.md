# Seto laulu alternatiivne noodikiri
Current application is the digital solution for creating and listening to notations of Seto multi-part singing in an alternative notation system. 
It is part of a research project called **Teaching Seto polyphonic singing with the help of an alternative musical notation** by the Estonian Literary Museum.

### Components:

#### React Frontend
- The client-side part of the application.
- Allows the user to create and listen to notations, communicates with the backend via API requests.

#### Node.js Backend
- The server-side part of the application.
- Handles the business logic, processes API requests from the frontend, and interacts with the database.

#### Postgres Database
- Relational database where the application's data is stored.

#### Nginx:
- Serves as the web server and reverse proxy for the React frontend.
- It routes incoming HTTP requests to the appropriate service (in this case, the React frontend).

#### Docker & Docker Compose:
- Each part of the application is containerized using Docker.
- Docker Compose is used to orchestrate and manage these containers.


![alt text](ui/public/architecture.png)

### Running app on server
Make sure you have **Docker** and **Docker Compose** (2.17.0+) installed:

https://docs.docker.com/engine/

https://docs.docker.com/compose/install/standalone/

Create **.env**, **nginx.conf** and a **docker-compose.yml** files in the root directory where you want to run the application. Use *.example* files from the code repository as base. Parameters that should be changed are marked by comments.

#### Build Docker containers
```shell
docker-compose build
```
This also takes care of the initial database setup and creates the necessary tables. It inserts some example data to the database, but most importantly it creates an admin user that the application requires for management. 

**NB!** Check *database/scripts/insert_data.sql* and change the corresponding password hash. You can use **Bcrypt-Generator** to generate the hash: https://bcrypt-generator.com.
#### Run Docker containers
```shell
docker-compose up -d
```

#### Releasing changes
Releasing new changes is simple, you just need to rebuild the Docker images and containers. Code gets pulled directly from GitHub - specific branch is denoted by BRANCH parameter in .env file. The default branch is 'master', which should be used for all new releases.
```shell
docker-compose down
docker-compose build
docker-compose up -d
```

#### Rollback
Change the branch parameter in *.env* to specific tag version (I will create a tag for each new version). For example:
```yaml
BRANCH=1.0.0
```
Then follow the regular release process.
```shell
docker-compose down
docker-compose build
docker-compose up -d
```

### Local development
Local development requires database setup. The easiest way is to follow the instructions listed above (*Running app on server*). Alternatively, you can set up the database yourself and run the scripts in *database/scripts*.

#### Clone the repository
```shell
git clone https://github.com/taneltorn/setoalt.git
cd setoalt
```

#### Create and update .env
```shell
cp .env.example .env
```
Update the values based on your environment. For example:
```
LOG_LEVEL=info

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=setoalt
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

ALLOWED_ORIGIN=http://localhost:5173
JWT_SECRET_KEY=somesecret

VITE_ENVIRONMENT=local
VITE_API_URL=http://localhost:3000
```


#### Running backend
```shell
cd api
npm run dev
```

#### Running frontend
```shell
cd ui
npm run dev
```