# Ordering Stack POS Integrator - Example

This projects is a starter kit for building POS integrations for Ordering Stack platform. 
All POS specific code is placed in src/pos/pos-integration-impl.js. In this example, to show general idea POS is fully mocked.

It connects to specific restaurant (one of specified tenant restaurants) in Ordering Stack platform and:
* regurarly (for example once a day) uploads products definitions into Ordering Stack tenants account
* listens (on web socket) for new incoming orders from any of Ordering Stack channels (web, mobile, kiosk)

Documentation of Ordering Stack API can be found here: [https://docs.orderingstack.com](https://docs.orderingstack.com).


## Starting pos-integrator-example

create and edit .env file and place there following parameters:

* TENANT - tenant Id
* VENUE - venue Id 
* BASE_URL - Ordering API url 
* BASIC_AUTH - Basic auth for API encoded in Base64

```
npm install
npm start
```

This project is part of [Ordering Stack](http://orderingstack.com), omnichannel ordering platform for resturant chains.
