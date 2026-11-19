terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "kateradmin-anestin-2026"
    key    = "ui/terraform.tfstate"
    region = "eu-north-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# Finds the existing backend server instead of creating a new one.
data "aws_instance" "backend" {
  filter {
    name   = "tag:Name"
    values = ["node-deployment"]
  }

  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}