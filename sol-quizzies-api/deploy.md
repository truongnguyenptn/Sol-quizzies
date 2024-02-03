docker build -t sol-quizzies-api:demo .
docker tag sol-quizzies-api:demo   522927643345.dkr.ecr.ap-southeast-1.amazonaws.com/sol-quizzies-api:demo;
docker push 522927643345.dkr.ecr.ap-southeast-1.amazonaws.com/sol-quizzies-api:demo;