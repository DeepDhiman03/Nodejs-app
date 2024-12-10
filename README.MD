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
   sudo systemctl start jenkins
