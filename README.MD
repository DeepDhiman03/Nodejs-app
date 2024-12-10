# CI/CD Pipeline for Node.js Application

This project demonstrates the implementation of a CI/CD pipeline for a Node.js application using Jenkins, Docker, Kubernetes (on AWS EKS), and AWS services. The pipeline automates the process of testing, building, and deploying the application, as well as notifying the team on deployment success or failure.

## Approach

### Step 1: Launch an EC2 Instance and Install Jenkins
1. Launch an EC2 instance on AWS.
2. Install Jenkins on the EC2 instance:
   - Ensure that Jenkins is accessible via the public IP of your EC2 instance.

### Step 2: Create an EKS Cluster
1. Use AWS EKS to create a Kubernetes cluster:
   - Follow the AWS documentation to set up EKS 
   - Once the cluster is created, make sure it is properly configured with AWS CLI and kubectl.

### Step 3: Install Docker, kubectl, and AWS CLI on EC2
1. Install Docker:
   - Follow the instructions [here](https://docs.docker.com/get-docker/).
2. Install kubectl for Kubernetes cluster management:
   - Follow the instructions [here](https://kubernetes.io/docs/tasks/tools/install-kubectl/).
3. Install AWS CLI for AWS services interaction:
   - Follow the instructions [here](https://aws.amazon.com/cli/).

### Step 4: Install Node.js and npm for the Project
1. Install Node.js and npm (Node Package Manager) on the EC2 instance:
   - Use the following command for installation:
     ```sh
     sudo apt update
     sudo apt install nodejs npm -y
     ```
  

### Step 5: Run Jenkins Server
1. Start the Jenkins server by running:
   ```sh
   sudo systemctl start jenkin
   ```

2. Enable the Jenkins server
   ```sh
   sudo systemctl enable jenkins
   ```
3. Access the Jenkins UI through the EC2 instance's public IP at http://<EC2_PUBLIC_IP>:8080



## Step 6: Create a Jenkins Pipeline

Once Jenkins is up and running, follow these steps to create a new pipeline job:

1. Go to the Jenkins UI.
2. Click on **New Item**.
3. Select **Pipeline**.
4. Enter a job name.
5. In the pipeline configuration, define the pipeline code in the **Pipeline** section.

## Step 7: Set Up Jenkins Credentials

You need to store your AWS and Docker credentials in Jenkins using the **Credentials** feature:

### AWS Credentials
- Store your AWS access keys to interact with AWS services like EKS.
- Navigate to **Jenkins Dashboard > Manage Jenkins > Manage Credentials** to add these credentials.

### Docker Credentials
- Store Docker Hub credentials for pushing images to Docker Hub.
- Similarly, use the **Credentials** feature in Jenkins to securely store Docker credentials.

## Step 8: Configure Jenkins SMTP for Email Notifications

To receive email notifications about the success or failure of your pipeline, configure the Jenkins SMTP server:

1. Go to **Manage Jenkins > Configure System**.
2. In the **E-mail Notification** section, configure the SMTP server settings
3. Test the SMTP configuration by sending a test email.



## Step 10: Pipeline Stages

The pipeline consists of several stages, each performing a specific task to build, test, and deploy the Node.js application. Below is an explanation of each stage:

## Pipeline Stages

1. **Checkout**  
   - **Description**: This stage checks out the latest code from the Git repository, specifically from the main branch.
   - **Command**: `git checkout main`

2. **Install Dependencies**  
   - **Description**: Installs the required dependencies for the Node.js application using npm.
   - **Command**: `npm install`

3. **Run Tests**  
   - **Description**: Executes the tests defined in the project using npm.
   - **Command**: `npm test`

4. **Build Docker Image**  
   - **Description**: Builds a Docker image for the Node.js application, preparing it for deployment.
   - **Command**: `docker build -t <image_name>:<tag> .`

5. **Push Image to DockerHub**  
   - **Description**: Pushes the Docker image to Docker Hub using stored credentials for the repository.
   - **Command**: `docker push <image_name>:<tag>`

6. **Deploy to Kubernetes**  
   - **Description**: Deploys the application to an EKS (Elastic Kubernetes Service) cluster using kubectl and Kubernetes manifests.
   - **Command**:
       ```
        aws eks --region us-east-1 update-kubeconfig --name Nodejsapp-cluster
        kubectl apply -f nodejs-app-deployment.yaml
        kubectl apply -f nodejs-app-service.yaml`
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


## Project Screenshots

Here are some screenshots of the project:

1. **Screenshot 1**:  
   ![Screenshot (1755)](https://github.com/user-attachments/assets/ea352738-a108-4601-b58f-d96314eba086)  
   _Description: A screenshot showing the application ._

2. **Screenshot 2**:  
   ![Screenshot (1752)](https://github.com/user-attachments/assets/34f01062-ecd2-4237-9b70-8a76423c06d1)  
   _Description: A screenshot showing the CI/CD pipeline execution in Jenkins._

3. **Screenshot 3**:  
   ![Screenshot (1750)](https://github.com/user-attachments/assets/3be730c8-9368-4a3f-a4c9-ed829683dc01)
   _Description: A screenshot of the application running on Kubernetes._





