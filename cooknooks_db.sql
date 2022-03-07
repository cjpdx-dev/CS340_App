
DROP TABLE IF EXISTS OrderItems;

DROP TABLE IF EXISTS ShipmentItems;

DROP TABLE IF EXISTS CustomerPayMethods;

DROP TABLE IF EXISTS CustomerAddresses;

DROP TABLE IF EXISTS ProductPrices;

DROP TABLE IF EXISTS Shipments;

DROP TABLE IF EXISTS PayMethods;

DROP TABLE IF EXISTS Addresses;

DROP TABLE IF EXISTS Transactions;

DROP TABLE IF EXISTS Products;

DROP TABLE IF EXISTS Orders;

DROP TABLE IF EXISTS Customers;


CREATE TABLE Customers (	
    customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    date_of_birth DATE NOT NULL,
    email_address VARCHAR(65)
) ENGINE = InnoDB;


CREATE TABLE Orders (
    order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    when_created DATETIME NOT NULL,
    when_processed DATETIME,
    is_closed TINYINT NOT NULL,
    when_closed DATETIME,
    CONSTRAINT `Orders_fk_customer_id`
        FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE Products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(45) NOT NULL,
    color VARCHAR(45) NOT NULL,
    weight_lbs DECIMAL NOT NULL,
    volume_cubic_inches DECIMAL NOT NULL,
    in_stock_qty INT NOT NULL,
    reorder_at_qty INT NOT NULL,
    is_discontinued TINYINT NOT NULL
) ENGINE = InnoDB;


CREATE TABLE ProductPrices (
    price_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    price DECIMAL NOT NULL,
    date_active DATETIME NOT NULL,
    date_inactive DATETIME,
    CONSTRAINT `ProductPrice_fk_product_id`
        FOREIGN KEY (product_id) REFERENCES Products (product_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE OrderItems (
    order_line_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_qty INT NOT NULL,
    CONSTRAINT `OrderItem_fk_order_id`
        FOREIGN KEY (order_id) REFERENCES Orders (order_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,
    CONSTRAINT `OrderItem_fk_product_id`
        FOREIGN KEY (product_id) REFERENCES Products (product_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE Addresses (
    address_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    address1 VARCHAR(45) NOT NULL,
    address2 VARCHAR(45) NOT NULL,
    city VARCHAR(45) NOT NULL,
    `state` VARCHAR(45) NOT NULL,
    zipcode VARCHAR(45) NOT NULL,
    country VARCHAR(45) NOT NULL
) ENGINE = InnoDB;


CREATE TABLE CustomerAddresses (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    address_id INT NOT NULL,
    CONSTRAINT `CustomerAddress_fk_customer_id`
        FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,
    CONSTRAINT `CustomerAddress_fk_address_id`
        FOREIGN KEY (address_id) REFERENCES Addresses (address_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE Shipments (
    shipment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    address_id INT NOT NULL,
    datetime_created DATETIME NOT NULL,
    tracking_number VARCHAR(45) NOT NULL,
    total_lbs DECIMAL NOT NULL,
    total_cubic_in DECIMAL NOT NULL,
    shipping_cost DECIMAL NOT NULL,
    datetime_ready DATETIME,
    datetime_shipped DATETIME,
    datetime_arrived DATETIME,
    CONSTRAINT `Shipment_fk_order_id`
        FOREIGN KEY (order_id) REFERENCES Orders (order_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,
    CONSTRAINT `Shipment_fk_address_id`
        FOREIGN KEY (address_id) REFERENCES Addresses (address_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE ShipmentItems (
    shipment_line_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    product_id INT NOT NULL,
    item_qty INT NOT NULL,
    CONSTRAINT `ShipmentItem_fk_shipment_id`
        FOREIGN KEY (shipment_id) REFERENCES Shipments (shipment_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,
    CONSTRAINT `ShipmentItem_fk_product_id`
        FOREIGN KEY (product_id) REFERENCES Products (product_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE PayMethods (
    pay_method_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    address_id INT NOT NULL,
    card_type VARCHAR(45) NOT NULL,
    last_four_digits INT NOT NULL,
    expiration_date DATE,
    CONSTRAINT `PayMethod_fk_address_id`
        FOREIGN KEY (address_id) REFERENCES Addresses (address_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE CustomerPayMethods (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    pay_method_id INT NOT NULL,
    CONSTRAINT `CustomerPayMethod_fk_customer_id`
        FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,
    CONSTRAINT `CustomerPayMethod_fk_pay_method_id`
        FOREIGN KEY (pay_method_id) REFERENCES PayMethods (pay_method_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE Transactions (
    transaction_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    pay_method_id INT NOT NULL,
    transaction_amount DECIMAL NOT NULL,
    datetime_charged DATETIME NOT NULL,
    confirmation_code VARCHAR(45) NOT NULL,
    check_sum VARCHAR(45) NOT NULL,
    datetime_success DATETIME NOT NULL,
    CONSTRAINT `Transaction_fk_order_id`
        FOREIGN KEY (order_id) REFERENCES Orders (order_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT,
    CONSTRAINT `Transaction_fk_pay_method_id`
        FOREIGN KEY (pay_method_id) REFERENCES PayMethods (pay_method_id)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
) ENGINE = InnoDB;


------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO Customers
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Customers(first_name, last_name, date_of_birth, email_address)
VALUES
	("Chris", "Jacobs", "1988-11-27", "jacobsc2@oregonstate.edu"),
	("Jane", "Johnson", "1992-12-28", "janejohnson@example.edu");

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO Orders
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Orders(customer_id, when_created)
SELECT 	customer_id,
		"2022-02-23 01:01:01" AS when_created

FROM Customers
WHERE customer_id = 1;


INSERT INTO Orders(customer_id, when_created)
SELECT 	customer_id,
		"2022-02-22 01:01:01" AS when_created

FROM Customers
WHERE customer_id = 1;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO Addresses
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Addresses 
			( 	
				first_name, 
				last_name, 
				address1, 
				address2, 
				city, 
				state, 
				zipcode, 
				country
			)
VALUES
	("Chris", "Jacobs", "1234 Newport Drive", "Apt. 101", "Wilmington", "Delaware", "19804", "United States"),
	("Jane", "Johnson", "2345 Washington Street", "Apt. 205", "Portland", "Oregon", "97202", "United States");

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO CustomerAddresses
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO CustomerAddresses (customer_id, address_id) 	
SELECT 	customer_id, address_id

FROM 	Customers, Addresses
WHERE 	Customers.customer_id = 1 AND 
		Addresses.address_id = 1;


INSERT INTO CustomerAddresses (customer_id, address_id) 	
SELECT 	customer_id, address_id

FROM 	Customers, Addresses
WHERE 	Customers.customer_id = 2 AND 
		Addresses.address_id = 2;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO PayMethods
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO PayMethods (address_id, card_type, last_four_digits, expiration_date)
SELECT 	address_id,
		"VISA" AS card_type,
		"8176" AS last_four_digits,
		"2025-2-1" AS expiration_date

FROM 	Addresses
WHERE 	Addresses.address_id = 1;


INSERT INTO PayMethods (address_id, card_type, last_four_digits, expiration_date)
SELECT 	address_id,
		"VISA" AS card_type,
		"9871" AS card_type,
		"2024-5-1" AS expiration_date

FROM 	Addresses
WHERE 	Addresses.address_id = 2;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO CustomerPayMethods
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO CustomerPayMethods (customer_id, pay_method_id)
SELECT  customer_id,
		pay_method_id

FROM 	Customers,
		PayMethods
WHERE   Customers.customer_id = 1 AND
		PayMethods.pay_method_id = 1;


INSERT INTO CustomerPayMethods (customer_id, pay_method_id)
SELECT  customer_id,
		pay_method_id

FROM 	Customers,
		PayMethods
WHERE   Customers.customer_id = 2 AND
		PayMethods.pay_method_id = 2;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO Products
-- Notes: Why is MariaDB automatically truncating DECIMAL values?
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Products
			(
				product_name,
				color,
				weight_lbs,
				volume_cubic_inches,
				in_stock_qty,
				reorder_at_qty,
				is_discontinued
			)
VALUES
	("cookbook #1", "blue", 2.8, 104.5, 10, 3, 0),
	("cookbook #2", "red", 3.5, 125.7, 5, 3, 0);

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO Shipments
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Shipments
			(
				order_id,
				address_id,
				datetime_created,
				tracking_number,
				total_lbs,
				total_cubic_in,
				shipping_cost
			)
SELECT 	order_id,
		address_id,
		"2022-2-3 01:01:01" AS datetime_created,
		"C1T687H85FWJ78PD" AS tracking_number,
		0 AS total_lbs,
		0 AS total_cubic_in,
		0.00 AS shipping_cost
		
FROM  	Orders, Addresses
WHERE  	Orders.order_id = 1 AND
		Addresses.address_id = 1;


INSERT INTO Shipments
			(
				order_id,
				address_id,
				datetime_created,
				tracking_number,
				total_lbs,
				total_cubic_in,
				shipping_cost
			)
SELECT 	order_id,
		address_id,
		"2022-2-23 01:01:01" AS datetime_created,
		"C1T687H85FWJ78PD" AS tracking_number,
		0 AS total_lbs,
		0 AS total_cubic_in,
		0.00 AS shipping_cost

FROM  	Orders, Addresses
WHERE  	Orders.order_id = 2 AND
		Addresses.address_id = 2;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO ShipmentItems
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO ShipmentItems (shipment_id, product_id, item_qty)
SELECT 	shipment_id,
		product_id,
		1 as item_qty

FROM  	Shipments, Products
WHERE  	Shipments.shipment_id = 1 AND
		Products.product_id = 1;


INSERT INTO ShipmentItems (shipment_id, product_id, item_qty)
SELECT 	shipment_id,
		product_id,
		1 as item_qty

FROM  	Shipments, Products
WHERE  	Shipments.shipment_id = 1 AND
		Products.product_id = 2;


INSERT INTO ShipmentItems (shipment_id, product_id, item_qty)
SELECT 	shipment_id,
		product_id,
		2 as item_qty

FROM  	Shipments, Products
WHERE  	Shipments.shipment_id = 1 AND
		Products.product_id = 1;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO OrderItems
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO OrderItems (order_id, product_id, product_qty)
SELECT 	order_id,
		product_id,
		1 AS product_qty

FROM  	Orders, Products
WHERE  	Orders.order_id = 1 AND
		Products.product_id = 1;


INSERT INTO OrderItems (order_id, product_id, product_qty)
SELECT 	order_id,
		product_id,
		1 AS product_qty

FROM  	Orders, Products
WHERE  	Orders.order_id = 1 AND
		Products.product_id = 2;


INSERT INTO OrderItems (order_id, product_id, product_qty)
SELECT 	order_id,
		product_id,
		2 AS product_qty

FROM  	Orders, Products
WHERE  	Orders.order_id = 2 AND
		Products.product_id = 1;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO ProductPrices
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO ProductPrices (product_id, price, date_active)
SELECT 	product_id,
		19.99 AS price,
		"2022-2-23 01:01:01" AS date_active

FROM Products
WHERE Products.product_id = 1;


INSERT INTO ProductPrices (product_id, price, date_active)
SELECT 	product_id,
		12.99 AS price,
		"2022-2-23 01:01:01" AS date_active

FROM Products
WHERE Products.product_id = 2;

------------------------------------------------------------------------------------------------------------------------------------------------
-- INSERT INTO Transactions
------------------------------------------------------------------------------------------------------------------------------------------------
INSERT INTO Transactions 
			(
				order_id, 
				pay_method_id,
				transaction_amount,
				datetime_charged,
				confirmation_code,
				check_sum,
				datetime_success
			)
SELECT 	order_id,
		pay_method_id,
		32.98 AS transaction_amount,
		"2022-2-23 01:01:01" AS datetime_charged,
		"9816541897116582" AS confirmation_code,
		"JH18-2T56-KO29-83KJ" AS check_sum,
		"2022-2-23 01:01:01" AS datetime_success

FROM  	Orders, PayMethods
WHERE  	Orders.order_id = 1 AND
		PayMethods.pay_method_id = 1; 


INSERT INTO Transactions 
			(
				order_id, 
				pay_method_id,
				transaction_amount,
				datetime_charged,
				confirmation_code,
				check_sum,
				datetime_success
			)
SELECT 	order_id,
		pay_method_id,
		39.98 AS transaction_amount,
		"2022-2-23 01:01:01" AS datetime_charged,
		"9816541897116582" AS confirmation_code,
		"JH18-2T56-KO29-83KJ" AS check_sum,
		"2022-2-23 01:01:01" AS datetime_success

FROM  	Orders, PayMethods
WHERE  	Orders.order_id = 2 AND
		PayMethods.pay_method_id = 2; 
