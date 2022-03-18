-- Customers
SELECT * FROM Customers;

SELECT * FROM Customers WHERE customer_id = ?

SELECT * FROM Customers WHERE first_name = ?; AND last_name = ?;
SELECT * FROM Customers WHERE last_name = ?;
SELECT * FROM Customers WHERE first_name = ?;

INSERT INTO Customers (first_name, last_name, email_address, date_of_birth) VALUES (?, ?, ?, ?)


-- Orders 
SELECT Orders.order_id, Customers.customer_id, Customers.first_name, Customers.last_name, Orders.when_created, Orders.order_status  
FROM Orders JOIN Customers WHERE Orders.customer_id = Customers.customer_id;

SELECT Orders.order_id, Customers.customer_id, Customers.first_name, Customers.last_name, Orders.when_created, Orders.order_status 
FROM Orders JOIN Customers WHERE Orders.order_id = ? AND Orders.customer_id = Customers.customer_id;

INSERT INTO Orders (customer_id, when_created) VALUES (?, ?);

UPDATE Orders SET Orders.order_status = ? WHERE Orders.order_id = ?;

DELETE FROM Orders WHERE order_id = ?;


-- OrderItems
SELECT OrderItems.order_line_id, Products.product_id, Products.product_name, Products.color, Products.price, Products.weight_lbs, Products.volume_cubic_inches 
FROM Products JOIN OrderItems ON Products.product_id = OrderItems.product_id 
JOIN Orders ON OrderItems.order_id = Orders.order_id 
WHERE Orders.order_id = ?

SELECT PayMethods.pay_method_id, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date 
FROM PayMethods JOIN CustomerPayMethods ON PayMethods.pay_method_id = CustomerPayMethods.pay_method_id 
WHERE CustomerPayMethods.customer_id = ?

SELECT Products.product_id, Products.product_name, Products.color, Products.price, Products.in_stock_qty, Products.is_discontinued 
FROM Products WHERE in_stock_qty > 0 AND is_discontinued != 1

INSERT INTO OrderItems (order_id, product_id) VALUES (?, ?)

DELETE FROM OrderItems WHERE order_line_id = ?


-- Products
SELECT * FROM Products;

SELECT * FROM Products ORDER BY in_stock_qty;

SELECT * FROM Products ORDER BY price;

SELECT * FROM Products ORDER BY price, in_stock_qty;

SELECT * FROM Products WHERE product_id = ?

SELECT * FROM Products WHERE product_name = ?;

SELECT * FROM Products WHERE product_name = ? ORDER BY in_stock_qty;

SELECT * FROM Products WHERE product_name = ? ORDER BY price, in_stock_qty;

INSERT INTO Products (product_name, color, weight_lbs, volume_cubic_inches, in_stock_qty, reorder_at_qty, is_discontinued)
VALUES (?, ?, ?, ?, ?, ?, ?);


-- PayMethods
SELECT PayMethods.pay_method_id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date
FROM PayMethods JOIN Addresses ON PayMethods.address_id = Addresses.address_id;

SELECT CustomerPayMethods.id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date
FROM CustomerPayMethods JOIN PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id
                        JOIN Addresses ON PayMethods.address_id = Addresses.address_id
                        WHERE PayMethods.pay_method_id = ?;


SELECT  CustomerPayMethods.id, Addresses.first_name, Addresses.last_name, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date
FROM    CustomerPayMethods  JOIN    PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id
                            JOIN    Addresses ON PayMethods.address_id = Addresses.address_id
                            WHERE   CustomerPayMethods.customer_id = ?;


SELECT  CustomerAddresses.id, Addresses.address_id, Addresses.address1, Addresses.address2, Addresses.city, Addresses.state, Addresses.zipcode, Addresses.country
FROM    CustomerAddresses   JOIN    Addresses ON CustomerAddresses.address_id = Addresses.address_id
                            WHERE   CustomerAddresses.customer_id = ?;

INSERT INTO Addresses (first_name, last_name, address1, address2, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)

INSERT INTO CustomerAddresses (customer_id, address_id) VALUES (?,?);

INSERT INTO PayMethods (address_id, card_type, last_four_digits, expiration_date) VALUES (?,?,?,?);

INSERT INTO CustomerPayMethods (customer_id, pay_method_id) VALUES (?,?);


-- Transactions

SELECT * FROM Transactions WHERE Transactions.pay_method_id = ?

SELECT OrderItems.order_id, SUM(Products.price) AS totalPrice 
FROM OrderItems JOIN Products ON Products.product_id = OrderItems.product_id 
                WHERE OrderItems.order_id = ? 
                GROUP BY OrderItems.order_id;

INSERT INTO Transactions (order_id, pay_method_id, transaction_amount, datetime_charged) VALUES (?, ?, ?, ?)


-- Customer Pay Methods

SELECT CustomerPayMethods.id, PayMethods.pay_method_id, PayMethods.card_type, PayMethods.last_four_digits, PayMethods.expiration_date 
FROM CustomerPayMethods JOIN PayMethods ON CustomerPayMethods.pay_method_id = PayMethods.pay_method_id 
                        WHERE CustomerPayMethods.customer_id = ?


-- Customer Addresses

SELECT  CustomerAddresses.id, Addresses.address_id, Addresses.address1, Addresses.address2, Addresses.city, Addresses.state, Addresses.zipcode, Addresses.country 
FROM    CustomerAddresses  JOIN Addresses ON CustomerAddresses.address_id = Addresses.address_id 
                        WHERE CustomerAddresses.customer_id = ?


-- Addresses
SELECT * FROM Addresses;

SELECT * FROM Addresses WHERE address_id = ?;

SELECT * FROM Customers WHERE Customers.customer_id = ?

INSERT INTO Addresses (first_name, last_name, address1, address2, city, state, zipcode, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?); SELECT LAST_INSERT_ID()

INSERT INTO CustomerAddresses (customer_id, address_id) VALUES (?,?)



