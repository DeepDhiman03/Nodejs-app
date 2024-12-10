pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = "deepdhiman"
        IMAGE_NAME = "nodejs-app"
        IMAGE_TAG = "latest"
    }
    stages {
        stage('Checkout') {
            steps {
                echo "Checking out the code..."
                git branch: 'main', url: 'https://github.com/DeepDhiman03/backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    echo 'Installing dependencies...'
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo 'Running tests...'
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh "docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerHubCred', 
                    passwordVariable: 'dockerHubPass', 
                    usernameVariable: 'dockerHubUser')]) {
                        sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
                        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withAWS(region: 'us-east-1', credentials: 'AWS_CREDENTIALS_ID') {
                        sh 'aws eks --region us-east-1 update-kubeconfig --name Nodejsapp-cluster'
                        sh 'kubectl apply -f nodejs-app-deployment.yaml'
                        sh 'kubectl apply -f nodejs-app-service.yaml'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
            sh "docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} || true"
        }

        success {
            echo "Deployment successful!"
            emailext(
                subject: "Deployment Successful: Build #${BUILD_NUMBER} - ${IMAGE_NAME}:${IMAGE_TAG}",
                body: "The deployment of ${IMAGE_NAME}:${IMAGE_TAG} was successful.",
                to: "dhimandeepesh03@gmail.com"
            )
        }
        failure {
            echo "Deployment failed!"
            emailext(
                subject: "Deployment Failed: Build #${BUILD_NUMBER} - ${IMAGE_NAME}:${IMAGE_TAG}",
                body: "The deployment of ${IMAGE_NAME}:${IMAGE_TAG} failed.",
                to: "dhimandeepesh03@gmail.com"
            )
        }
    }
}
