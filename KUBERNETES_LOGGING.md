# Kubernetes Logging Guide

This guide explains how to view and manage logs for your SwasthaYogi project running in Kubernetes.

## Viewing Pod Logs

1. **List all pods:**
   ```sh
   kubectl get pods
   ```
2. **View logs for a pod:**
   ```sh
   kubectl logs <pod-name>
   ```
3. **View logs for a specific container in a pod:**
   ```sh
   kubectl logs <pod-name> -c <container-name>
   ```
4. **Stream logs in real-time:**
   ```sh
   kubectl logs -f <pod-name>
   ```

## Aggregating Logs (Optional)
For advanced log management, use:
- **ELK Stack (Elasticsearch, Logstash, Kibana)**
- **Grafana Loki**
- **Cloud logging solutions (GCP, AWS, Azure)**

These tools collect logs from all pods and let you search, filter, and visualize logs in dashboards.

## Troubleshooting
- If you can't see logs, check pod status:
  ```sh
  kubectl describe pod <pod-name>
  ```
- For crash loops, use:
  ```sh
  kubectl logs --previous <pod-name>
  ```

## References
- [Kubernetes Logging Docs](https://kubernetes.io/docs/concepts/cluster-administration/logging/)
- [kubectl logs](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs)

---
For more help, ask GitHub Copilot!
