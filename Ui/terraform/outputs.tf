output "ec2_public_ip" {
  value       = data.aws_instance.backend.public_ip
  description = "Public IP address of the backend server"
}