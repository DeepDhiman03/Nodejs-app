# CI/CD Pipeline for Node.js Application

This project demonstrates the implementation of a CI/CD pipeline for a Node.js application using Jenkins, Docker, Kubernetes (on AWS EKS), and AWS services. The pipeline automates the process of testing, building, and deploying the application, as well as notifying the team on deployment success or failure.

## Approach

### Step 1: Launch an EC2 Instance and Install Jenkins
1. Launch an EC2 instance on AWS.
2. Install Jenkins on the EC2 instance:
   - Ensure that Jenkins is accessible via the public IP of your EC2 instance.

### Step 2: Create an EKS Cluster
1. Use AWS EKS to create a Kubernetes cluster:
   - Once the cluster is created, make sure it is properly configured with AWS CLI and kubectl.

### Step 3: Install Docker, kubectl, and AWS CLI on EC2
1. Install Docker:
2. Install kubectl for Kubernetes cluster management:
3. Install AWS CLI for AWS services interaction:


### Step 4: Run Jenkins Server
1. Start the Jenkins server by running:
   ```sh
   sudo systemctl start jenkins
   ```
2. Enable the Jenkins server
   ```sh
   sudo systemctl enable jenkins
   ```
3. Access the Jenkins UI through the EC2 instance's public IP at http://<EC2_PUBLIC_IP>:8080


### Step 5: Install Node.js and npm for the Project
1. Install Node.js and npm (Node Package Manager) on the EC2 instance:
   - Use the following command for installation:
     ```sh
     sudo apt update
     sudo apt install nodejs npm -y
     ```
2. Adding current User to the Docker Group :
   - Use the following commands:
     ```sh
     sudo usermod -aG docker $USER && newgrp docker
     sudo usermod -aG docker jenkins
     sudo systemctl restart jenkins
     ```

## Step 6: Create a Jenkins Pipeline

Once Jenkins is up and running, follow these steps to create a new pipeline job:

1. Go to the Jenkins UI.
2. Click on New Item
3. Select Pipeline.
4. Enter a job name.
5. In the pipeline configuration, define the pipeline code in the Pipeline section.

## Step 7: Set Up Jenkins Credentials

You need to store your AWS and Docker credentials in Jenkins using the Credentials feature:

### AWS Credentials
- Store your AWS access keys to interact with AWS services like EKS.

### Docker Credentials
- Store Docker Hub credentials for pushing images to Docker Hub.

## Step 8: Configure Jenkins SMTP for Email Notifications

To receive email notifications about the success or failure of your pipeline, configure the Jenkins SMTP server:

1. Go to Manage Jenkins > Configure System.
2. In the E-mail Notification section, configure the SMTP server settings
3. Test the SMTP configuration by sending a test email.



## Step 10: Pipeline Stages

The pipeline consists of several stages, each performing a specific task to build, test, and deploy the Node.js application. Below is an explanation of each stage:

## Pipeline Stages

1. **Checkout**  
   - **Description**: This stage checks out the latest code from the Git repository, specifically from the main branch.
   - **Command**: `git branch: '<branch-name>', url: '<your-git-url>`

2. **Install Dependencies**  
   - **Description**: Installs the required dependencies for the Node.js application using npm.
   - **Command**: `npm install`

3. **Run Tests**  
   - **Description**: Executes the tests defined in the project using npm.
   - **Command**: `npm test`

4. **Build Docker Image**  
   - **Description**: Builds a Docker image for the Node.js application, preparing it for deployment.
   - **Command**: `docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} .`

5. **Push Image to DockerHub**  
   - **Description**: Pushes the Docker image to Docker Hub using stored credentials for the repository.
   - **Command**: 
       ```sh
        withCredentials([usernamePassword(credentialsId: 'dockerHubCred', 
        passwordVariable: 'dockerHubPass', 
        usernameVariable: 'dockerHubUser')]) {
        sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"
        sh "docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
       ```

6. **Deploy to Kubernetes**  
   - **Description**: Deploys the application to an EKS (Elastic Kubernetes Service) cluster using kubectl and Kubernetes manifests.
   - **Command**:
       ```
         withAWS(region: ${REGION}, credentials: 'AWS_CREDENTIALS_ID') { 
            sh 'aws eks --region ${REGION} update-kubeconfig --name ${CLUSTER_NAME}'
            sh 'kubectl apply -f nodejs-app-deployment.yaml'
            sh 'kubectl apply -f nodejs-app-service.yaml'
         }
      ```

## Post-deployment Steps

These are the steps that occur after the deployment is completed.

1. **Always**  
   - **Description**: Cleans up any Docker images after the deployment process, ensuring that the image is removed from the local machine.
   - **Command**:  
     ```bash
     docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} || true
     ```

2. **Success**  
   - **Description**: Sends a success email upon successful deployment.
   - **Email Subject**: "Deployment Successful: Build #${BUILD_NUMBER} - ${IMAGE_NAME}:${IMAGE_TAG}"
   - **Email Body**: "The deployment of ${IMAGE_NAME}:${IMAGE_TAG} was successful."
   - **Recipient**: `dhimandeepesh03@gmail.com`

3. **Failure**  
   - **Description**: Sends a failure email if the deployment fails.
   - **Email Subject**: "Deployment Failed: Build #${BUILD_NUMBER} - ${IMAGE_NAME}:${IMAGE_TAG}"
   - **Email Body**: "The deployment of ${IMAGE_NAME}:${IMAGE_TAG} failed."
   - **Recipient**: `dhimandeepesh03@gmail.com`


## Step 11:  Using a Jenkinsfile to Access the Pipeline Script

### Steps to Use a Jenkinsfile

1. **Create a Jenkinsfile**  
   - Save the pipeline script in a file named `Jenkinsfile` at the root of your project repository.

2. **Set the SCM**   
   - In the **Pipeline** section, choose **Pipeline script from SCM**.  
   - Set the SCM to your version control system (e.g., Git).  
   - Provide the repository URL and specify the Jenkinsfile location.

3. **Trigger the Pipeline**  
   - Save the Jenkins job configuration.  
   - set up webhooks for automatic triggers on code changes or pull request.


## Project Screenshots

Here are some screenshots of the project:

1. **Screenshot 1**:  
   ![Screenshot (1754)](https://github.com/user-attachments/assets/f500c8f8-fa15-486f-b8e7-33ea2bc40d87)  
   _Description: A screenshot showing the application._

   ![Screenshot (1755)](https://github.com/user-attachments/assets/ea352738-a108-4601-b58f-d96314eba086)  
   _Description: A screenshot showing the application uptime on api /status._


2. **Screenshot 2**:  
   ![Screenshot (1752)](https://github.com/user-attachments/assets/34f01062-ecd2-4237-9b70-8a76423c06d1)  
   _Description: A screenshot showing the CI/CD pipeline execution in Jenkins._

3. **Screenshot 3**:  
   ![Screenshot (1750)](https://github.com/user-attachments/assets/3be730c8-9368-4a3f-a4c9-ed829683dc01)
   _Description: A screenshot of the application running on Kubernetes._

4. **Screenshot 4**:  
   ![Screenshot (1759)](https://github.com/user-attachments/assets/82ab13f7-7b32-4e41-9ca1-e559f21fcad0)
   _Description: A screenshot of the notification  on pipeline success._

5. **Screenshot 5**:  
   ![Screenshot (1760)](https://github.com/user-attachments/assets/6795f264-8a19-4655-9e0d-2e823ad82ae7)
   _Description: A screenshot of the notification  on pipeline failure._





