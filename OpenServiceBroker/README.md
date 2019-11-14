# Prepare Environment

Follow this documentation: https://docs.mongodb.com/atlas-open-service-broker/master/installation/

### Attention: 
I ran into the following issue when running 
```helm install svc-cat/catalog --name catalog --namespace catalog```:

Error: validation failed: unable to recognize "": no matches for kind "Deployment" in version "extensions/v1beta1"

Link: https://github.com/kubernetes-sigs/service-catalog/issues/2716


Workaround:

Download the chart into the current directory:
```helm fetch svc-cat/catalog```

Extract the files and search for “extensions/v1beta1” in all of them. 
Replace “extensions/v1beta1” with “apps/v1”.

I had to change it in the following files:
- apiserver-deployment.yaml
- controller-manager-deployment.yaml

Then deploy the modified charts with the following command:

```helm install . --name catalog --namespace catalog --values values.yaml```


# Demo Flow
## Show the Configuration
Show installed service catalog:

```helm search service-catalog```

Show Atlas open service broker:

```svcat get brokers -n atlas```

## Provision an M10 Cluster on Atlas

Show the config file replicaSet.yaml
```vim replicaSet.yaml```

Deploy the cluster:

```kubectl apply -f replicaSet.yaml```

List all provisioned instances including status:

```svcat get instances -n atlas```

Show the Atlas GUI and the provisioned cluster.

## Create a User
Show the config file user.yaml

```vim user.yaml```

Deploy the user:

```kubectl apply -f user.yaml```

Display the provisioned resources

```svcat describe instance my-atlas-cluster -n atlas```

Show the Atlas GUI and the provisioned user.

## Connect with the User WIP

Get credentials:

```kubectl get secret atlas-user-1 -n atlas -o yaml```

Decode the base64 encoded values:

```
data:
  password: OE9HelhZenhzenVBTUpaMEdVSEQyaGZNa09IU0VydzVES1diVDBlNGxLVT0=
  uri: bW9uZ29kYitzcnY6Ly8yYjYzYTMwNS0wNmIyLTExZWEtODM2OC0yOG0yaS5tb25nb2RiLm5ldA==
  username: NjJmMjlmYzgtMDZiYS0xMWVhLTgzNjgtMDI0MmFjMTEwMDAz
```
  
with

```echo < password | uri | username > | base64 --decode```

Connect to the Atlas cluster:

```mongo < data.uri > --username < data.username > ```

Insert some data and show it through the Atlas console.

# Cleanup
Remove provisioned database users:
```svcat unbind my-atlas-cluster -n atlas```

## Deprovision cluster:
```svcat deprovision my-atlas-cluster -n atlas```

# Additional commands

https://github.com/mongodb/mongodb-atlas-service-broker/tree/master/dev
