# Seto laulu alternatiivne noodikiri
Antud veebirakendus on osa Kirjandusmuuseumi loovuurimuslikust projektist "Seto mitmehäälse laulu õpetamine alternatiivse noodikirja abil".

### Running app on server
Make sure you have **Docker** and **Docker Compose** installed.

Create **.env** and a **docker-compose.yml** files in project root. Use *.example* files as base.

#### Build Docker containers
```shell
docker-compose build
```
This also takes care of the database setup and creates the necessary tables. It inserts some initial data to the database, but most importantly it creates an admin user that the application requires. Check *database/scripts/insert_data.sql* and change the corresponding password hash. You can use **Bcrypt-Generator** to generate the hash: https://bcrypt-generator.com.
#### Run Docker containers
```shell
docker-compose up -d
```

#### Releasing changes
```shell
docker-compose down
docker-compose build
docker-compose up -d
```


#### Rollback
Change the branch parameter in *.env* to specific tag version. For example:
```yaml
BRANCH=1.0.0
```
Then follow regular release process.
```shell
docker-compose down
docker-compose build
docker-compose up -d
```


### Local development
Local development requires database setup. The easiest way is to follow the instructions listed above (*Runing app on server*). Alternatively, you can set up the database yourself and run the scripts in *database/scripts*.

#### Clone the repository
```shell
git clone https://github.com/taneltorn/setoalt.git
cd setoalt
```

#### Create and update .env
```shell
cp .env.example .env
```
Update the values based on your environment.

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