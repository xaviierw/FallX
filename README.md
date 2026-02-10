## FallX – IoT-Based Fall Detection and Monitoring System for Elderly Care

FallX is an Internet of Things (IoT)–based fall detection system designed to monitor elderly individuals and provide timely alerts to caregivers in the event of a fall. The system combines wearable sensor hardware with a cloud-based backend to enable real-time detection, data storage, analytics, and notification delivery.

FallX focuses on rapid response, reliability, scalability, and responsible use of technology to support independent living and eldercare.

## Project Objectives

- Detect fall events using wearable sensor data
- Transmit fall events securely to the cloud in real time
- Notify caregivers promptly when a fall is detected
- Store and analyse fall history for monitoring and insights
- Provide a web-based dashboard for caregivers to view incidents and trends

## System Overview

- A wearable device continuously monitors motion data
- Fall detection is performed locally on the device
- Detected events are published to the cloud via MQTT
- Cloud services process, store, and analyse fall data
- Caregivers receive alerts and can view data via a dashboard

## Hardware Components

- M5Stack Core2 (ESP32-based wearable device)
- Built-in MPU6886 IMU (accelerometer and gyroscope)
- On-device screen, vibration motor, and buzzer for alerts

## Fall Detection Logic

- Uses accelerometer and gyroscope data
- Detects high-impact acceleration events
- Confirms fall through stillness detection after impact
- Threshold-based logic implemented directly on the device
- Reduces false positives by combining multiple conditions

## Cloud Architecture

- AWS IoT Core
  - Secure MQTT communication with wearable devices
  - Device authentication using X.509 certificates

- AWS Lambda
  - Processes incoming fall events
  - Enriches data (e.g. device-to-resident mapping)
  - Triggers notifications and analytics workflows

- Amazon DynamoDB
  - Stores fall history records
  - Stores resident and device mapping data
  - Supports fast, scalable queries

- Amazon SNS
  - Sends real-time alerts to caregivers
  - Supports email and SMS notifications

- Amazon Kinesis Data Firehose
  - Streams fall event data from Lambda
  - Delivers data to Amazon S3 for analytics

- Amazon S3
  - Stores raw and processed fall event data
  - Hosts frontend dashboard assets

- Amazon Athena
  - Performs SQL-based analysis on fall history stored in S3
  - Enables ad-hoc and historical analytics

- Amazon QuickSight
  - Visualises fall trends and KPIs
  - Provides dashboards for long-term monitoring and insights

- Amazon API Gateway
  - Provides secure REST APIs for frontend access

- Amazon Cognito
  - Handles caregiver authentication and access control

## Web Dashboard

- Frontend coded using React
- Hosted as a static web application on Amazon S3
- Key features:
  - KPI cards (e.g. falls in last 24 hours / 7 days)
  - Trend charts showing fall frequency over time
  - Recent fall incidents table
  - Resident-specific fall history
  - Secure login for caregivers using Cognito

## Data Analytics and Visualization

- Real-time fall data streamed via Firehose to S3
- Historical data queried using Athena
- Aggregated insights visualised using QuickSight
- Dashboards designed for clarity and rapid situational awareness

## Tech Stack

- Embedded / IoT:
  - ESP32 (M5Stack Core2)
  - MicroPython / UIFlow

- Cloud / Backend:
  - AWS IoT Core
  - AWS Lambda
  - Amazon DynamoDB
  - Amazon SNS
  - Amazon Kinesis Data Firehose
  - Amazon S3
  - Amazon Athena
  - Amazon QuickSight
  - Amazon API Gateway
  - Amazon Cognito

- Frontend:
  - React
  - HTML, CSS, JavaScript

## Project Structure

- device/
  - Wearable device firmware and fall detection logic

- lambdas/
  - Backend Lambda functions for event processing and APIs

- dashboard/
  - React frontend caregiver dashboard

- analytics/
  - Athena queries and QuickSight dashboard configuration

- infrastructure/
  - Cloud configuration and service setup documentation

## Deployment

- Wearable devices registered as AWS IoT Things
- Cloud services deployed using AWS Console
- Firehose configured to stream data into S3
- Athena tables created over S3 datasets
- QuickSight dashboards connected to Athena
- Frontend built and deployed to Amazon S3
- Secure access enforced using Cognito authentication

## Ethical and Safety Considerations

- FallX is designed to support, not replace, human caregivers
- Alerts assist timely response but do not guarantee outcomes
- Data privacy, access control, and security are prioritised
- System limitations and false positives are acknowledged

## Future Improvements

- Machine learning–based fall classification
- Adaptive thresholds per individual
- Integration with emergency services
- Mobile application for caregivers
- Device battery and health monitoring
- Multi-resident and multi-caregiver scaling

## Author

- FallX was developed as an IoT and cloud computing project focused on eldercare, rapid response systems, and scalable cloud-based monitoring.
