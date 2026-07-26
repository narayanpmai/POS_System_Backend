--
-- PostgreSQL database dump
--

\restrict 2ENzUKkkcMSD10uAnFn10pX9LaEWcWhMFiN0mKwGrqyZKbgHG4j7MhkAb7kvXpu

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Account" (
    id integer NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    description text,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Account" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Account_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Account_id_seq" OWNER TO postgres;

--
-- Name: Account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Account_id_seq" OWNED BY public."Account".id;


--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLog" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    action text NOT NULL,
    details text,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."ActivityLog" OWNER TO postgres;

--
-- Name: ActivityLog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ActivityLog_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ActivityLog_id_seq" OWNER TO postgres;

--
-- Name: ActivityLog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ActivityLog_id_seq" OWNED BY public."ActivityLog".id;


--
-- Name: Brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Brand" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    status text DEFAULT 'ACTIVE'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Brand" OWNER TO postgres;

--
-- Name: Brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Brand_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Brand_id_seq" OWNER TO postgres;

--
-- Name: Brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Brand_id_seq" OWNED BY public."Brand".id;


--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO postgres;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id integer NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    logo text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: Company_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Company_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Company_id_seq" OWNER TO postgres;

--
-- Name: Company_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Company_id_seq" OWNED BY public."Company".id;


--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id integer NOT NULL,
    name text NOT NULL,
    email text,
    phone text,
    address text,
    points integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "walletBalance" double precision DEFAULT 0 NOT NULL,
    "membershipTierId" integer,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Customer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Customer_id_seq" OWNER TO postgres;

--
-- Name: Customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Customer_id_seq" OWNED BY public."Customer".id;


--
-- Name: DeletedSale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DeletedSale" (
    id integer NOT NULL,
    "originalSaleId" integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "customerName" text,
    "cashierName" text,
    "totalAmount" double precision NOT NULL,
    "itemsSnapshot" text NOT NULL,
    "deletedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "deletedById" integer NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."DeletedSale" OWNER TO postgres;

--
-- Name: DeletedSale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."DeletedSale_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."DeletedSale_id_seq" OWNER TO postgres;

--
-- Name: DeletedSale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."DeletedSale_id_seq" OWNED BY public."DeletedSale".id;


--
-- Name: Expense; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Expense" (
    id integer NOT NULL,
    "referenceNo" text,
    category text NOT NULL,
    amount double precision NOT NULL,
    description text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Expense" OWNER TO postgres;

--
-- Name: ExpenseCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ExpenseCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."ExpenseCategory" OWNER TO postgres;

--
-- Name: ExpenseCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ExpenseCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."ExpenseCategory_id_seq" OWNER TO postgres;

--
-- Name: ExpenseCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ExpenseCategory_id_seq" OWNED BY public."ExpenseCategory".id;


--
-- Name: Expense_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Expense_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Expense_id_seq" OWNER TO postgres;

--
-- Name: Expense_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Expense_id_seq" OWNED BY public."Expense".id;


--
-- Name: FiscalYear; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FiscalYear" (
    id integer NOT NULL,
    name text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isActive" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."FiscalYear" OWNER TO postgres;

--
-- Name: FiscalYear_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."FiscalYear_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."FiscalYear_id_seq" OWNER TO postgres;

--
-- Name: FiscalYear_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."FiscalYear_id_seq" OWNED BY public."FiscalYear".id;


--
-- Name: Income; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Income" (
    id integer NOT NULL,
    "referenceNo" text,
    category text NOT NULL,
    amount double precision NOT NULL,
    description text,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Income" OWNER TO postgres;

--
-- Name: IncomeCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."IncomeCategory" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."IncomeCategory" OWNER TO postgres;

--
-- Name: IncomeCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."IncomeCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."IncomeCategory_id_seq" OWNER TO postgres;

--
-- Name: IncomeCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."IncomeCategory_id_seq" OWNED BY public."IncomeCategory".id;


--
-- Name: Income_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Income_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Income_id_seq" OWNER TO postgres;

--
-- Name: Income_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Income_id_seq" OWNED BY public."Income".id;


--
-- Name: InventoryTransaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryTransaction" (
    id integer NOT NULL,
    "productId" integer NOT NULL,
    type text NOT NULL,
    quantity double precision NOT NULL,
    reason text,
    "supplierId" integer,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."InventoryTransaction" OWNER TO postgres;

--
-- Name: InventoryTransaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."InventoryTransaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."InventoryTransaction_id_seq" OWNER TO postgres;

--
-- Name: InventoryTransaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."InventoryTransaction_id_seq" OWNED BY public."InventoryTransaction".id;


--
-- Name: JournalEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JournalEntry" (
    id integer NOT NULL,
    "referenceNo" text,
    description text NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."JournalEntry" OWNER TO postgres;

--
-- Name: JournalEntryLine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."JournalEntryLine" (
    id integer NOT NULL,
    "journalEntryId" integer NOT NULL,
    "accountId" integer NOT NULL,
    debit double precision DEFAULT 0 NOT NULL,
    credit double precision DEFAULT 0 NOT NULL,
    description text
);


ALTER TABLE public."JournalEntryLine" OWNER TO postgres;

--
-- Name: JournalEntryLine_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JournalEntryLine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."JournalEntryLine_id_seq" OWNER TO postgres;

--
-- Name: JournalEntryLine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JournalEntryLine_id_seq" OWNED BY public."JournalEntryLine".id;


--
-- Name: JournalEntry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."JournalEntry_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."JournalEntry_id_seq" OWNER TO postgres;

--
-- Name: JournalEntry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."JournalEntry_id_seq" OWNED BY public."JournalEntry".id;


--
-- Name: MembershipTier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MembershipTier" (
    id integer NOT NULL,
    name text NOT NULL,
    "minPoints" integer DEFAULT 0 NOT NULL,
    "discountPercent" double precision DEFAULT 0 NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."MembershipTier" OWNER TO postgres;

--
-- Name: MembershipTier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."MembershipTier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."MembershipTier_id_seq" OWNER TO postgres;

--
-- Name: MembershipTier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."MembershipTier_id_seq" OWNED BY public."MembershipTier".id;


--
-- Name: PaymentTransaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PaymentTransaction" (
    id integer NOT NULL,
    "saleId" integer,
    provider text NOT NULL,
    "transactionRef" text NOT NULL,
    amount double precision NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "paymentDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."PaymentTransaction" OWNER TO postgres;

--
-- Name: PaymentTransaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PaymentTransaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PaymentTransaction_id_seq" OWNER TO postgres;

--
-- Name: PaymentTransaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PaymentTransaction_id_seq" OWNED BY public."PaymentTransaction".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    "SKU" text NOT NULL,
    barcode text,
    description text,
    price double precision NOT NULL,
    cost double precision NOT NULL,
    stock double precision DEFAULT 0 NOT NULL,
    "minStockAlert" integer DEFAULT 5 NOT NULL,
    unit text DEFAULT 'pcs'::text NOT NULL,
    "categoryId" integer NOT NULL,
    "brandId" integer,
    "taxRate" double precision DEFAULT 0.0 NOT NULL,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO postgres;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Purchase" (
    id integer NOT NULL,
    "poNumber" text NOT NULL,
    "supplierId" integer,
    status text DEFAULT 'RECEIVED'::text NOT NULL,
    "totalAmount" double precision NOT NULL,
    "purchaseDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" integer NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO postgres;

--
-- Name: PurchaseItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseItem" (
    id integer NOT NULL,
    "purchaseId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity double precision NOT NULL,
    "measurementUnit" text DEFAULT 'pcs'::text NOT NULL,
    "costPrice" double precision NOT NULL,
    total double precision NOT NULL
);


ALTER TABLE public."PurchaseItem" OWNER TO postgres;

--
-- Name: PurchaseItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PurchaseItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PurchaseItem_id_seq" OWNER TO postgres;

--
-- Name: PurchaseItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PurchaseItem_id_seq" OWNED BY public."PurchaseItem".id;


--
-- Name: PurchaseReturn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseReturn" (
    id integer NOT NULL,
    "returnNo" text NOT NULL,
    "purchaseId" integer NOT NULL,
    "supplierId" integer NOT NULL,
    reason text,
    "totalAmount" double precision NOT NULL,
    "returnDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."PurchaseReturn" OWNER TO postgres;

--
-- Name: PurchaseReturnItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseReturnItem" (
    id integer NOT NULL,
    "purchaseReturnId" integer NOT NULL,
    "purchaseItemId" integer NOT NULL,
    quantity double precision NOT NULL,
    "refundAmount" double precision NOT NULL
);


ALTER TABLE public."PurchaseReturnItem" OWNER TO postgres;

--
-- Name: PurchaseReturnItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PurchaseReturnItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PurchaseReturnItem_id_seq" OWNER TO postgres;

--
-- Name: PurchaseReturnItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PurchaseReturnItem_id_seq" OWNED BY public."PurchaseReturnItem".id;


--
-- Name: PurchaseReturn_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PurchaseReturn_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PurchaseReturn_id_seq" OWNER TO postgres;

--
-- Name: PurchaseReturn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PurchaseReturn_id_seq" OWNED BY public."PurchaseReturn".id;


--
-- Name: Purchase_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Purchase_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Purchase_id_seq" OWNER TO postgres;

--
-- Name: Purchase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Purchase_id_seq" OWNED BY public."Purchase".id;


--
-- Name: RewardPointHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RewardPointHistory" (
    id integer NOT NULL,
    "customerId" integer NOT NULL,
    points integer NOT NULL,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."RewardPointHistory" OWNER TO postgres;

--
-- Name: RewardPointHistory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RewardPointHistory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."RewardPointHistory_id_seq" OWNER TO postgres;

--
-- Name: RewardPointHistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RewardPointHistory_id_seq" OWNED BY public."RewardPointHistory".id;


--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Role_id_seq" OWNER TO postgres;

--
-- Name: Role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Role_id_seq" OWNED BY public."Role".id;


--
-- Name: Sale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Sale" (
    id integer NOT NULL,
    "invoiceNo" text NOT NULL,
    "customerId" integer,
    "cashierId" integer NOT NULL,
    subtotal double precision NOT NULL,
    "taxAmount" double precision NOT NULL,
    "discountAmount" double precision NOT NULL,
    "totalAmount" double precision NOT NULL,
    "paymentMethod" text NOT NULL,
    "paymentStatus" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Sale" OWNER TO postgres;

--
-- Name: SaleItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SaleItem" (
    id integer NOT NULL,
    "saleId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity double precision NOT NULL,
    price double precision NOT NULL,
    cost double precision NOT NULL,
    "taxAmount" double precision NOT NULL,
    total double precision NOT NULL
);


ALTER TABLE public."SaleItem" OWNER TO postgres;

--
-- Name: SaleItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SaleItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SaleItem_id_seq" OWNER TO postgres;

--
-- Name: SaleItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SaleItem_id_seq" OWNED BY public."SaleItem".id;


--
-- Name: SaleReturn; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SaleReturn" (
    id integer NOT NULL,
    "returnNo" text NOT NULL,
    "saleId" integer NOT NULL,
    "customerId" integer,
    reason text,
    "totalAmount" double precision NOT NULL,
    "returnDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."SaleReturn" OWNER TO postgres;

--
-- Name: SaleReturnItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SaleReturnItem" (
    id integer NOT NULL,
    "saleReturnId" integer NOT NULL,
    "saleItemId" integer NOT NULL,
    quantity double precision NOT NULL,
    "refundAmount" double precision NOT NULL
);


ALTER TABLE public."SaleReturnItem" OWNER TO postgres;

--
-- Name: SaleReturnItem_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SaleReturnItem_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SaleReturnItem_id_seq" OWNER TO postgres;

--
-- Name: SaleReturnItem_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SaleReturnItem_id_seq" OWNED BY public."SaleReturnItem".id;


--
-- Name: SaleReturn_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SaleReturn_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."SaleReturn_id_seq" OWNER TO postgres;

--
-- Name: SaleReturn_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SaleReturn_id_seq" OWNED BY public."SaleReturn".id;


--
-- Name: Sale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Sale_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Sale_id_seq" OWNER TO postgres;

--
-- Name: Sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Sale_id_seq" OWNED BY public."Sale".id;


--
-- Name: Shift; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Shift" (
    id integer NOT NULL,
    "employeeId" integer NOT NULL,
    "startTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endTime" timestamp(3) without time zone,
    "cashStart" double precision NOT NULL,
    "cashEnd" double precision,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Shift" OWNER TO postgres;

--
-- Name: Shift_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Shift_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Shift_id_seq" OWNER TO postgres;

--
-- Name: Shift_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Shift_id_seq" OWNED BY public."Shift".id;


--
-- Name: StoreSetting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."StoreSetting" (
    id integer NOT NULL,
    "storeName" text DEFAULT 'SmartPOS Retail'::text NOT NULL,
    address text DEFAULT '123 Business St, Tech City'::text NOT NULL,
    phone text DEFAULT '+1 555-0199'::text NOT NULL,
    email text DEFAULT 'info@smartpos.com'::text NOT NULL,
    "taxNumber" text DEFAULT 'TAX-987654321'::text NOT NULL,
    "currencySymbol" text DEFAULT 'Rs.'::text NOT NULL,
    "receiptHeader" text DEFAULT 'Thank you for shopping with us!'::text NOT NULL,
    "receiptFooter" text DEFAULT 'Please come again! Power by SmartPOS.'::text NOT NULL,
    "taxRateDefault" double precision DEFAULT 13.0 NOT NULL,
    "invoicePrefix" text DEFAULT 'PTRM'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."StoreSetting" OWNER TO postgres;

--
-- Name: StoreSetting_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."StoreSetting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."StoreSetting_id_seq" OWNER TO postgres;

--
-- Name: StoreSetting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."StoreSetting_id_seq" OWNED BY public."StoreSetting".id;


--
-- Name: Supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Supplier" (
    id integer NOT NULL,
    name text NOT NULL,
    "contactName" text,
    email text,
    phone text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."Supplier" OWNER TO postgres;

--
-- Name: Supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Supplier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Supplier_id_seq" OWNER TO postgres;

--
-- Name: Supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Supplier_id_seq" OWNED BY public."Supplier".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    "roleId" integer NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyId" integer DEFAULT 1 NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO postgres;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: Account id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account" ALTER COLUMN id SET DEFAULT nextval('public."Account_id_seq"'::regclass);


--
-- Name: ActivityLog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog" ALTER COLUMN id SET DEFAULT nextval('public."ActivityLog_id_seq"'::regclass);


--
-- Name: Brand id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand" ALTER COLUMN id SET DEFAULT nextval('public."Brand_id_seq"'::regclass);


--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: Company id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company" ALTER COLUMN id SET DEFAULT nextval('public."Company_id_seq"'::regclass);


--
-- Name: Customer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer" ALTER COLUMN id SET DEFAULT nextval('public."Customer_id_seq"'::regclass);


--
-- Name: DeletedSale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeletedSale" ALTER COLUMN id SET DEFAULT nextval('public."DeletedSale_id_seq"'::regclass);


--
-- Name: Expense id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense" ALTER COLUMN id SET DEFAULT nextval('public."Expense_id_seq"'::regclass);


--
-- Name: ExpenseCategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseCategory" ALTER COLUMN id SET DEFAULT nextval('public."ExpenseCategory_id_seq"'::regclass);


--
-- Name: FiscalYear id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FiscalYear" ALTER COLUMN id SET DEFAULT nextval('public."FiscalYear_id_seq"'::regclass);


--
-- Name: Income id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Income" ALTER COLUMN id SET DEFAULT nextval('public."Income_id_seq"'::regclass);


--
-- Name: IncomeCategory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IncomeCategory" ALTER COLUMN id SET DEFAULT nextval('public."IncomeCategory_id_seq"'::regclass);


--
-- Name: InventoryTransaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction" ALTER COLUMN id SET DEFAULT nextval('public."InventoryTransaction_id_seq"'::regclass);


--
-- Name: JournalEntry id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntry" ALTER COLUMN id SET DEFAULT nextval('public."JournalEntry_id_seq"'::regclass);


--
-- Name: JournalEntryLine id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntryLine" ALTER COLUMN id SET DEFAULT nextval('public."JournalEntryLine_id_seq"'::regclass);


--
-- Name: MembershipTier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembershipTier" ALTER COLUMN id SET DEFAULT nextval('public."MembershipTier_id_seq"'::regclass);


--
-- Name: PaymentTransaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction" ALTER COLUMN id SET DEFAULT nextval('public."PaymentTransaction_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Purchase id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase" ALTER COLUMN id SET DEFAULT nextval('public."Purchase_id_seq"'::regclass);


--
-- Name: PurchaseItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseItem_id_seq"'::regclass);


--
-- Name: PurchaseReturn id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturn" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseReturn_id_seq"'::regclass);


--
-- Name: PurchaseReturnItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturnItem" ALTER COLUMN id SET DEFAULT nextval('public."PurchaseReturnItem_id_seq"'::regclass);


--
-- Name: RewardPointHistory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RewardPointHistory" ALTER COLUMN id SET DEFAULT nextval('public."RewardPointHistory_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role" ALTER COLUMN id SET DEFAULT nextval('public."Role_id_seq"'::regclass);


--
-- Name: Sale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale" ALTER COLUMN id SET DEFAULT nextval('public."Sale_id_seq"'::regclass);


--
-- Name: SaleItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleItem" ALTER COLUMN id SET DEFAULT nextval('public."SaleItem_id_seq"'::regclass);


--
-- Name: SaleReturn id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturn" ALTER COLUMN id SET DEFAULT nextval('public."SaleReturn_id_seq"'::regclass);


--
-- Name: SaleReturnItem id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturnItem" ALTER COLUMN id SET DEFAULT nextval('public."SaleReturnItem_id_seq"'::regclass);


--
-- Name: Shift id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shift" ALTER COLUMN id SET DEFAULT nextval('public."Shift_id_seq"'::regclass);


--
-- Name: StoreSetting id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StoreSetting" ALTER COLUMN id SET DEFAULT nextval('public."StoreSetting_id_seq"'::regclass);


--
-- Name: Supplier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier" ALTER COLUMN id SET DEFAULT nextval('public."Supplier_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Account" (id, code, name, type, balance, description, "companyId") FROM stdin;
\.


--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (id, "userId", action, details, "timestamp", "companyId") FROM stdin;
\.


--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Brand" (id, name, slug, status, "createdAt", "updatedAt", "companyId") FROM stdin;
2	स्थानीय उत्पादन	-	ACTIVE	2026-07-23 11:06:40.689	2026-07-23 11:06:40.689	1
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, description, "createdAt", "updatedAt", "companyId") FROM stdin;
21	खाद्यान्न 		2026-07-23 11:16:26.763	2026-07-23 11:16:26.763	1
22	तरकारी जन्य सामाग्री		2026-07-23 11:17:18.619	2026-07-23 11:17:18.619	1
23	सरसफाइ जन्य सामाग्री		2026-07-23 11:18:07.122	2026-07-23 11:18:44.203	1
24	चप्पल		2026-07-23 11:19:07.248	2026-07-23 11:19:07.248	1
25	सजावटको सामान		2026-07-23 11:20:18.785	2026-07-23 11:20:18.785	1
26	ढाकाको सामाग्री		2026-07-23 11:20:44.161	2026-07-23 11:20:44.161	1
27	अचार		2026-07-23 11:20:59.095	2026-07-23 11:20:59.095	1
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Company" (id, name, email, phone, address, logo, "isActive", "createdAt", "updatedAt") FROM stdin;
1	SmartPOS Default Company	admin@smartpos.com	+1 (555) 000-0000	123 Smart Way	\N	t	2026-07-23 07:14:43.775	2026-07-23 07:14:43.775
4	Melanchi KoseliGhar	ito.melamchimun@gmail.com	9851253598	Melamchi, Sindhupalchok	\N	t	2026-07-23 09:19:05.6	2026-07-26 16:06:11.115
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, name, email, phone, address, points, "createdAt", "updatedAt", "walletBalance", "membershipTierId", "companyId") FROM stdin;
\.


--
-- Data for Name: DeletedSale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DeletedSale" (id, "originalSaleId", "invoiceNo", "customerName", "cashierName", "totalAmount", "itemsSnapshot", "deletedAt", "deletedById", "companyId") FROM stdin;
1	1	PTRM-20260723-79237	\N	Arpana Shrestha	720	[{"productName":"टिम्मुर ","quantity":6,"price":120,"total":720}]	2026-07-23 11:33:33.641	7	1
2	3	PTRM-20260723-34185	Narayan Chhetri	Arpana Shrestha	12	[{"productName":"अकबरे खुर्सानिको अचार","quantity":2,"price":6,"total":12}]	2026-07-24 01:43:10.503	8	1
3	4	PTRM-20260724-81432	Narayan Chhetri	Melamchi Municipality	120	[{"productName":"टिमुर","quantity":1,"price":120,"total":120}]	2026-07-24 09:42:57.38	9	1
\.


--
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Expense" (id, "referenceNo", category, amount, description, date, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: ExpenseCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ExpenseCategory" (id, name, description, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: FiscalYear; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FiscalYear" (id, name, "startDate", "endDate", "isActive", "createdAt", "updatedAt", "companyId") FROM stdin;
2	२०८३/०८४	2026-07-17 00:00:00	2027-06-15 00:00:00	t	2026-07-23 10:39:34.521	2026-07-23 10:39:38.346	1
\.


--
-- Data for Name: Income; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Income" (id, "referenceNo", category, amount, description, date, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: IncomeCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."IncomeCategory" (id, name, description, "createdAt", "updatedAt", "companyId") FROM stdin;
\.


--
-- Data for Name: InventoryTransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryTransaction" (id, "productId", type, quantity, reason, "supplierId", "userId", "createdAt", "companyId") FROM stdin;
11	4	STOCK_IN	500	Purchase PUR-384396330	3	7	2026-07-23 12:57:19.497	1
12	4	STOCK_OUT	2	POS Sale Outflow - Invoice PTRM-20260723-34185	\N	7	2026-07-23 13:33:55.004	1
13	5	STOCK_IN	1	Purchase PUR-44939438	18	7	2026-07-23 16:40:37.235	1
14	4	STOCK_IN	2	Reverted Sale Deletion - Invoice PTRM-20260723-34185	\N	8	2026-07-24 01:43:10.513	1
15	4	STOCK_OUT	1	POS Sale Outflow - Invoice PTRM-20260724-81432	\N	8	2026-07-24 01:57:21.801	1
16	5	STOCK_IN	19.5	Purchase PUR-743593508	26	7	2026-07-24 08:27:50.625	1
17	34	STOCK_IN	1	Purchase PUR-922743419	25	7	2026-07-24 08:28:24.669	1
18	33	STOCK_IN	2	Purchase PUR-871292114	25	7	2026-07-24 08:28:57.94	1
19	36	STOCK_IN	2	Purchase PUR-91004431	25	7	2026-07-24 08:29:33.504	1
20	35	STOCK_IN	2	Purchase PUR-22804660	25	7	2026-07-24 08:29:54.924	1
21	32	STOCK_IN	9	Purchase PUR-102266537	24	7	2026-07-24 08:30:57.615	1
22	31	STOCK_IN	10	Purchase PUR-102266537	24	7	2026-07-24 08:30:57.623	1
23	30	STOCK_IN	13	Purchase PUR-881953402	23	7	2026-07-24 08:31:22.866	1
24	29	STOCK_IN	1	Purchase PUR-397654339	22	7	2026-07-24 08:35:01.193	1
25	27	STOCK_IN	1	Purchase PUR-664427907	21	7	2026-07-24 08:35:29.278	1
26	26	STOCK_IN	6.5	Purchase PUR-9109603	20	7	2026-07-24 08:36:44.067	1
27	25	STOCK_IN	4	Purchase PUR-234785596	19	7	2026-07-24 08:37:17.359	1
28	24	STOCK_IN	9.5	Purchase PUR-946530222	18	7	2026-07-24 08:38:02.049	1
29	23	STOCK_IN	100	Purchase PUR-604812690	17	7	2026-07-24 08:38:40.21	1
30	22	STOCK_IN	35	Purchase PUR-349287153	16	7	2026-07-24 08:39:15.689	1
31	21	STOCK_IN	3	Purchase PUR-293507621	15	7	2026-07-24 08:39:59.686	1
32	20	STOCK_IN	3.9	Purchase PUR-627761806	14	7	2026-07-24 08:40:44.417	1
33	19	STOCK_IN	10	Purchase PUR-744225865	6	7	2026-07-24 08:42:07.681	1
34	12	STOCK_IN	10	Purchase PUR-744225865	6	7	2026-07-24 08:42:07.689	1
35	8	STOCK_IN	20	Purchase PUR-744225865	6	7	2026-07-24 08:42:07.694	1
36	17	STOCK_IN	10	Purchase PUR-947921797	11	7	2026-07-24 08:44:08.556	1
37	18	STOCK_IN	26	Purchase PUR-947921797	11	7	2026-07-24 08:44:08.564	1
38	16	STOCK_IN	20	Purchase PUR-947921797	11	7	2026-07-24 08:44:08.57	1
39	13	STOCK_IN	1	Purchase PUR-947921797	11	7	2026-07-24 08:44:08.575	1
40	15	STOCK_IN	19	Purchase PUR-739981742	13	7	2026-07-24 08:44:57.066	1
41	14	STOCK_IN	25	Purchase PUR-619367632	12	7	2026-07-24 08:45:20.917	1
42	11	STOCK_IN	52	Purchase PUR-962193075	10	7	2026-07-24 08:45:57.669	1
43	9	STOCK_IN	28.5	Purchase PUR-17964480	9	7	2026-07-24 08:46:30.425	1
44	6	STOCK_IN	1	Purchase PUR-10984758	8	7	2026-07-24 08:47:20.024	1
45	9	STOCK_OUT	28.5	Purchase Reversal/Edit PUR-17964480	9	7	2026-07-24 08:47:39.303	1
46	9	STOCK_IN	28.5	Purchase Edit Re-stock PUR-17964480	7	7	2026-07-24 08:47:39.335	1
47	10	STOCK_IN	4	Purchase PUR-682420062	9	7	2026-07-24 08:48:09.619	1
48	7	STOCK_IN	7	Purchase PUR-151657616	5	7	2026-07-24 08:49:36.742	1
49	6	STOCK_IN	1	Purchase PUR-269039489	4	7	2026-07-24 08:50:17.138	1
50	4	STOCK_IN	2.5	Purchase PUR-258388909	3	7	2026-07-24 08:50:54.857	1
51	5	STOCK_IN	12	Purchase PUR-53661194	2	7	2026-07-24 08:51:19.71	1
52	29	STOCK_OUT	1	Purchase Reversal/Edit PUR-397654339	22	7	2026-07-24 09:28:35.335	1
53	29	STOCK_IN	500	Purchase Edit Re-stock PUR-397654339	22	7	2026-07-24 09:28:35.359	1
54	4	STOCK_IN	1	Reverted Sale Deletion - Invoice PTRM-20260724-81432	\N	9	2026-07-24 09:42:57.39	1
55	29	STOCK_OUT	500	Purchase Reversal/Edit PUR-397654339	22	9	2026-07-24 10:11:18.867	1
56	29	STOCK_IN	500	Purchase Edit Re-stock PUR-397654339	22	9	2026-07-24 10:11:18.896	1
\.


--
-- Data for Name: JournalEntry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JournalEntry" (id, "referenceNo", description, date, "companyId") FROM stdin;
\.


--
-- Data for Name: JournalEntryLine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."JournalEntryLine" (id, "journalEntryId", "accountId", debit, credit, description) FROM stdin;
\.


--
-- Data for Name: MembershipTier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MembershipTier" (id, name, "minPoints", "discountPercent", "companyId") FROM stdin;
\.


--
-- Data for Name: PaymentTransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PaymentTransaction" (id, "saleId", provider, "transactionRef", amount, status, "paymentDate", "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, "SKU", barcode, description, price, cost, stock, "minStockAlert", unit, "categoryId", "brandId", "taxRate", image, "createdAt", "updatedAt", "companyId") FROM stdin;
17	ताइचिन चिउरा 	Taichin Beaten Rice	284299665861		160	140	10	5	kg	21	2	0	\N	2026-07-24 07:58:04.889	2026-07-24 08:44:08.552	1
28	आलु	potato	505835957333		60	50	0	5	kg	21	2	0	\N	2026-07-24 08:16:44.316	2026-07-24 10:16:27.667	1
27	अदुवा 	aduwa	889373383082		0.2	0.16	1	5	gram	21	2	0	\N	2026-07-24 08:11:52.959	2026-07-24 09:29:41.632	1
26	लसुन	lasun	537996370151		260	200	6.5	5	kg	21	2	0	\N	2026-07-24 08:11:13.719	2026-07-24 08:36:44.063	1
34	डल सानो 	Small 	356983861822		400	350	1	5	pcs	25	2	0	\N	2026-07-24 08:22:23.633	2026-07-24 08:28:24.665	1
33	डल ठुलो 	Doll BIG	743201682285		600	520	2	5	pcs	25	2	0	\N	2026-07-24 08:21:42.097	2026-07-24 08:28:57.937	1
36	कुसन ठुलो 	kushan Big	399414219882		300	250	2	5	pcs	25	2	0	\N	2026-07-24 08:24:04.165	2026-07-24 08:29:33.501	1
35	कुसन सानो	kushan Small	064456526603		250	220	2	5	pcs	25	2	0	\N	2026-07-24 08:23:26.556	2026-07-24 08:29:54.92	1
32	हारपिक	Harpick	554620902717		100	90	9	5	pcs	23	2	0	\N	2026-07-24 08:20:44.433	2026-07-24 08:30:57.612	1
31	झोल साबन	Soap	952885821337		100	90	10	5	pcs	23	2	0	\N	2026-07-24 08:20:01.946	2026-07-24 08:30:57.62	1
30	किरिङ	keyring	848128246532		65	50	13	1	kg	25	2	0	\N	2026-07-24 08:18:58.162	2026-07-24 08:31:22.863	1
4	टिमुर	Timur	350715922889		120	90	502.5	3	pack	21	2	0	\N	2026-07-23 12:55:56.992	2026-07-24 10:25:45.582	1
25	गहुँको पिठो 	gahu ko pitho	447731117233		90	70	4	5	kg	21	2	0	\N	2026-07-24 08:10:30.965	2026-07-24 08:37:17.354	1
24	भटमास	Bhatmas	168778887212		150	140	9.5	5	kg	21	2	0	\N	2026-07-24 08:05:47.204	2026-07-24 08:38:02.046	1
23	खुमल ४	khumalchar	998383168082		135	115	100	5	kg	21	2	0	\N	2026-07-24 08:04:48.794	2026-07-24 08:38:40.207	1
22	बाटेको धुप	bateko dhup	228294444300		95	80	35	5	pack	25	2	0	\N	2026-07-24 08:03:25.617	2026-07-24 08:39:15.686	1
20	सातु पिठो 	Satu Pitho	498543408132		400	360	3.9	5	kg	21	2	0	\N	2026-07-24 08:01:15.045	2026-07-24 08:40:44.414	1
19	मुलाको अचार	mulako achar	977566251872		160	145	10	5	kg	27	2	0	\N	2026-07-24 08:00:11.279	2026-07-24 08:42:07.678	1
12	टिमुर अचार	Timur achar 	876019499788		275	250	10	2	box	27	2	0	\N	2026-07-24 07:51:55.599	2026-07-24 08:42:07.686	1
8	मेथिको अचार	methi achar	918261600710		295	270	20	3	pcs	27	2	0	\N	2026-07-24 07:45:37.944	2026-07-24 08:42:07.691	1
18	मकैको चिउरा 	मकैको चिउरा 	200617585676		150	125	26	5	kg	21	2	0	\N	2026-07-24 07:59:15.454	2026-07-24 08:44:08.561	1
16	रातो चिउरा 	Red Beaten Rice	567130746225		140	115	20	5	kg	21	2	0	\N	2026-07-24 07:56:57.604	2026-07-24 08:44:08.567	1
13	तोरिको तेल	toriko tel	113103259651		375	350	1	5	liter	21	2	0	\N	2026-07-24 07:53:04.174	2026-07-24 08:44:08.572	1
15	ब्राउन चामल	Brown Rice	730357578753		130	110	19	5	kg	21	2	0	\N	2026-07-24 07:55:17.282	2026-07-24 08:44:57.063	1
14	बासमती चामल	Basmati Chamal	935819952182		215	195	25	5	kg	21	2	0	\N	2026-07-24 07:53:51.628	2026-07-24 08:45:20.913	1
11	लोकल सिमी 	simi local	688665310381		185	150	52	5	kg	21	2	0	\N	2026-07-24 07:50:57.475	2026-07-24 08:45:57.665	1
29	अदुवा धुलो 	aduwa dhulo	295646953165		50	0.4	500	5	gram	21	2	0	\N	2026-07-24 08:18:10.751	2026-07-24 10:11:18.887	1
9	कोदोको पिठो	kodo 	962080452587		90	70	28.5	3	kg	21	2	0	\N	2026-07-24 07:46:57.079	2026-07-24 08:47:39.324	1
10	सिन्की 	sinki	432023034693		85	75	4	0	gram	21	2	0	\N	2026-07-24 07:50:14.984	2026-07-24 08:48:09.616	1
7	बेसार 	besar 	166543153136		60	35	7	3	kg	21	2	0	\N	2026-07-24 07:44:32.192	2026-07-24 08:49:36.739	1
6	गुन्दुक	Gundruk	311317493759		50	41	2	3	pack	21	2	0	\N	2026-07-24 01:50:01.426	2026-07-24 08:50:17.136	1
5	मकैको पिठो	Makai-01	514570650577	मे.न.पा-12	65	50	32.5	3	kg	21	2	0	\N	2026-07-23 16:38:36.06	2026-07-24 08:51:19.706	1
21	अकबरे अचार	akabare achar	443761076193		300	270	3	5	pcs	27	2	0	\N	2026-07-24 08:02:24.007	2026-07-24 10:14:19.438	1
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Purchase" (id, "poNumber", "supplierId", status, "totalAmount", "purchaseDate", "createdAt", "updatedAt", "userId", "companyId") FROM stdin;
5	PUR-384396330	3	RECEIVED	250	2026-07-23 12:57:15.738	2026-07-23 12:57:19.482	2026-07-23 12:57:19.482	7	1
6	PUR-44939438	18	RECEIVED	140	2026-07-23 16:40:35.023	2026-07-23 16:40:37.223	2026-07-23 16:40:37.223	7	1
7	PUR-743593508	26	RECEIVED	975	2026-07-24 08:27:48.39	2026-07-24 08:27:50.597	2026-07-24 08:27:50.597	7	1
8	PUR-922743419	25	RECEIVED	350	2026-07-24 08:28:22.541	2026-07-24 08:28:24.647	2026-07-24 08:28:24.647	7	1
9	PUR-871292114	25	RECEIVED	1040	2026-07-24 08:28:55.83	2026-07-24 08:28:57.931	2026-07-24 08:28:57.931	7	1
10	PUR-91004431	25	RECEIVED	500	2026-07-24 08:29:31.381	2026-07-24 08:29:33.487	2026-07-24 08:29:33.487	7	1
11	PUR-22804660	25	RECEIVED	440	2026-07-24 08:29:52.805	2026-07-24 08:29:54.909	2026-07-24 08:29:54.909	7	1
12	PUR-102266537	24	RECEIVED	1710	2026-07-24 08:30:55.494	2026-07-24 08:30:57.595	2026-07-24 08:30:57.595	7	1
13	PUR-881953402	23	RECEIVED	650	2026-07-24 08:31:20.757	2026-07-24 08:31:22.858	2026-07-24 08:31:22.858	7	1
15	PUR-664427907	21	RECEIVED	160	2026-07-24 08:35:27.156	2026-07-24 08:35:29.263	2026-07-24 08:35:29.263	7	1
16	PUR-9109603	20	RECEIVED	1300	2026-07-24 08:36:41.948	2026-07-24 08:36:44.052	2026-07-24 08:36:44.052	7	1
17	PUR-234785596	19	RECEIVED	280	2026-07-24 08:37:15.237	2026-07-24 08:37:17.34	2026-07-24 08:37:17.34	7	1
18	PUR-946530222	18	RECEIVED	1330	2026-07-24 08:37:59.941	2026-07-24 08:38:02.042	2026-07-24 08:38:02.042	7	1
19	PUR-604812690	17	RECEIVED	11500	2026-07-24 08:38:38.1	2026-07-24 08:38:40.201	2026-07-24 08:38:40.201	7	1
20	PUR-349287153	16	RECEIVED	2800	2026-07-24 08:39:13.58	2026-07-24 08:39:15.681	2026-07-24 08:39:15.681	7	1
21	PUR-293507621	15	RECEIVED	840	2026-07-24 08:39:57.453	2026-07-24 08:39:59.657	2026-07-24 08:39:59.657	7	1
22	PUR-627761806	14	RECEIVED	1404	2026-07-24 08:40:42.291	2026-07-24 08:40:44.393	2026-07-24 08:40:44.393	7	1
23	PUR-744225865	6	RECEIVED	9350	2026-07-24 08:42:05.556	2026-07-24 08:42:07.666	2026-07-24 08:42:07.666	7	1
24	PUR-947921797	11	RECEIVED	7300	2026-07-24 08:44:06.419	2026-07-24 08:44:08.53	2026-07-24 08:44:08.53	7	1
25	PUR-739981742	13	RECEIVED	2090	2026-07-24 08:44:52.908	2026-07-24 08:44:57.057	2026-07-24 08:44:57.057	7	1
26	PUR-619367632	12	RECEIVED	4875	2026-07-24 08:45:18.803	2026-07-24 08:45:20.907	2026-07-24 08:45:20.907	7	1
27	PUR-962193075	10	RECEIVED	7800	2026-07-24 08:45:55.532	2026-07-24 08:45:57.644	2026-07-24 08:45:57.644	7	1
29	PUR-10984758	8	RECEIVED	41	2026-07-24 08:47:17.9	2026-07-24 08:47:20.008	2026-07-24 08:47:20.008	7	1
28	PUR-17964480	7	RECEIVED	1995	2026-07-24 08:47:37.18	2026-07-24 08:46:30.418	2026-07-24 08:47:39.318	7	1
30	PUR-682420062	9	RECEIVED	300	2026-07-24 08:48:07.507	2026-07-24 08:48:09.611	2026-07-24 08:48:09.611	7	1
31	PUR-151657616	5	RECEIVED	245	2026-07-24 08:49:34.627	2026-07-24 08:49:36.734	2026-07-24 08:49:36.734	7	1
32	PUR-269039489	4	RECEIVED	41	2026-07-24 08:50:15.027	2026-07-24 08:50:17.131	2026-07-24 08:50:17.131	7	1
33	PUR-258388909	3	RECEIVED	225	2026-07-24 08:50:52.611	2026-07-24 08:50:54.829	2026-07-24 08:50:54.829	7	1
34	PUR-53661194	2	RECEIVED	600	2026-07-24 08:51:17.57	2026-07-24 08:51:19.684	2026-07-24 08:51:19.684	7	1
14	PUR-397654339	22	RECEIVED	200	2026-07-24 10:11:14.689	2026-07-24 08:35:01.178	2026-07-24 10:11:18.88	7	1
\.


--
-- Data for Name: PurchaseItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseItem" (id, "purchaseId", "productId", quantity, "measurementUnit", "costPrice", total) FROM stdin;
6	5	4	500	gram	0.5	250
7	6	5	1	kg	140	140
8	7	5	19.5	kg	50	975
9	8	34	1	pcs	350	350
10	9	33	2	pcs	520	1040
11	10	36	2	pcs	250	500
12	11	35	2	pcs	220	440
13	12	32	9	pcs	90	810
14	12	31	10	pcs	90	900
15	13	30	13	kg	50	650
17	15	27	1	kg	160	160
18	16	26	6.5	kg	200	1300
19	17	25	4	kg	70	280
20	18	24	9.5	kg	140	1330
21	19	23	100	kg	115	11500
22	20	22	35	pack	80	2800
23	21	21	3	pcs	280	840
24	22	20	3.9	kg	360	1404
25	23	19	10	kg	145	1450
26	23	12	10	box	250	2500
27	23	8	20	pcs	270	5400
28	24	17	10	kg	140	1400
29	24	18	26	kg	125	3250
30	24	16	20	kg	115	2300
31	24	13	1	liter	350	350
32	25	15	19	kg	110	2090
33	26	14	25	kg	195	4875
34	27	11	52	kg	150	7800
36	29	6	1	pack	41	41
37	28	9	28.5	kg	70	1995
38	30	10	4	gram	75	300
39	31	7	7	kg	35	245
40	32	6	1	pack	41	41
41	33	4	2.5	pack	90	225
42	34	5	12	kg	50	600
44	14	29	500	gram	0.4	200
\.


--
-- Data for Name: PurchaseReturn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseReturn" (id, "returnNo", "purchaseId", "supplierId", reason, "totalAmount", "returnDate", "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: PurchaseReturnItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseReturnItem" (id, "purchaseReturnId", "purchaseItemId", quantity, "refundAmount") FROM stdin;
\.


--
-- Data for Name: RewardPointHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RewardPointHistory" (id, "customerId", points, reason, "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description) FROM stdin;
1	Super Admin	System Administrator with full access
2	Admin	Administrator privileges
3	Cashier	POS sales cashier privileges
\.


--
-- Data for Name: Sale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Sale" (id, "invoiceNo", "customerId", "cashierId", subtotal, "taxAmount", "discountAmount", "totalAmount", "paymentMethod", "paymentStatus", "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: SaleItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SaleItem" (id, "saleId", "productId", quantity, price, cost, "taxAmount", total) FROM stdin;
\.


--
-- Data for Name: SaleReturn; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SaleReturn" (id, "returnNo", "saleId", "customerId", reason, "totalAmount", "returnDate", "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: SaleReturnItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SaleReturnItem" (id, "saleReturnId", "saleItemId", quantity, "refundAmount") FROM stdin;
\.


--
-- Data for Name: Shift; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Shift" (id, "employeeId", "startTime", "endTime", "cashStart", "cashEnd", status, "createdAt", "companyId") FROM stdin;
\.


--
-- Data for Name: StoreSetting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."StoreSetting" (id, "storeName", address, phone, email, "taxNumber", "currencySymbol", "receiptHeader", "receiptFooter", "taxRateDefault", "invoicePrefix", "updatedAt", "companyId") FROM stdin;
4	मेलम्ची कोसेलीघर	Melamchi, Sindhupalchok	9851253598	ito.melamchimun@gmail.com	TAX-987654321	Rs.	Thank you for shopping with us!	Please come again! Power by SmartPOS.	0	MLMC	2026-07-24 09:42:27.81	1
\.


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Supplier" (id, name, "contactName", email, phone, address, "createdAt", "updatedAt", "companyId") FROM stdin;
2	दावा लमिनी तामाङ	\N	\N	\N	मे.न.पा- 12	2026-07-23 11:24:48.802	2026-07-23 11:24:48.802	1
3	होम बहादुर तामाङ 	\N	\N	\N	मे.न.पा.-9	2026-07-23 11:26:04.44	2026-07-23 11:26:04.44	1
4	मथुरा सापकोटा 	\N	\N	\N	मे.न. पा -11	2026-07-23 16:27:01.996	2026-07-23 16:27:01.996	1
5	सानुकान्छा तामाङ 	\N	\N	\N	\N	2026-07-23 16:27:58.086	2026-07-23 16:27:58.086	1
7	राजकुमार सार्की 	\N	\N	\N	\N	2026-07-23 16:29:01.903	2026-07-23 16:29:01.903	1
8	तारा सापकोटा 	\N	\N	\N	\N	2026-07-23 16:29:22.809	2026-07-23 16:29:22.809	1
9	रामकृष्ण पुरी 	\N	\N	\N	\N	2026-07-23 16:29:48.5	2026-07-23 16:29:48.5	1
10	विरमान तामाङ 	\N	\N	\N	\N	2026-07-23 16:30:09.498	2026-07-23 16:30:09.498	1
6	सीता पौड्याल	\N	\N	\N	\N	2026-07-23 16:28:23.794	2026-07-23 16:30:56.817	1
11	परमेश्वर न्यौपाने	\N	\N	\N	मे.न. पा	2026-07-23 16:31:43.741	2026-07-23 16:31:43.741	1
12	उत्तम गिरी 	\N	\N	\N	\N	2026-07-23 16:32:07.173	2026-07-23 16:32:07.173	1
13	तारा श्रेष्ठ	\N	\N	\N	मे.न. पा	2026-07-23 16:32:47.954	2026-07-23 16:32:47.954	1
14	रञ्जु श्रेष्ठ	\N	\N	\N	मे.न. पा	2026-07-23 16:33:45.261	2026-07-23 16:33:45.261	1
15	सुजना श्रेष्ठ	\N	\N	\N	मे.न. पा	2026-07-23 16:34:14.848	2026-07-23 16:34:14.848	1
16	जुना कुँवर	\N	\N	\N	मे.न. पा	2026-07-23 16:34:55.37	2026-07-23 16:34:55.37	1
17	छत्र बा. अर्याल	\N	\N	\N	मे.न. पा	2026-07-23 16:35:33.31	2026-07-23 16:35:33.31	1
18	ओम कुमारी विष्ट	\N	\N	\N	मे.न. पा	2026-07-23 16:36:20.403	2026-07-23 16:36:20.403	1
19	ठाकुर ढंगाना 	\N	\N	\N	\N	2026-07-24 08:07:04.901	2026-07-24 08:07:04.901	1
20	सिता रावल	\N	\N	\N	\N	2026-07-24 08:07:16.494	2026-07-24 08:07:16.494	1
21	राजन कार्की 	\N	\N	\N	\N	2026-07-24 08:07:32.33	2026-07-24 08:07:32.33	1
22	लक्ष्मी नारायण तिवारी 	\N	\N	\N	\N	2026-07-24 08:07:54.077	2026-07-24 08:07:54.077	1
23	ज्यास्मी खड्का 	\N	\N	\N	\N	2026-07-24 08:08:18.437	2026-07-24 08:08:18.437	1
24	दिपक भुजेल	\N	\N	\N	\N	2026-07-24 08:08:47.979	2026-07-24 08:08:47.979	1
25	विन्दा खड्का	\N	\N	\N	\N	2026-07-24 08:09:05.892	2026-07-24 08:09:05.892	1
26	सिवराज घले	\N	\N	\N	\N	2026-07-24 08:09:25.373	2026-07-24 08:09:25.373	1
27	कान्छिमाया तामाङ 	\N	\N	\N	\N	2026-07-24 10:15:21.403	2026-07-24 10:15:21.403	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, "roleId", active, "createdAt", "updatedAt", "companyId") FROM stdin;
6	smartpanchpokhari@gmail.com	$2b$10$97ufbIvb6hImnKdkfJfBOeictdXCoPwB/WG5d1JmftE74/13l95ce	Smart Panchpokhari	1	t	2026-07-23 09:16:48.19	2026-07-23 09:16:48.19	1
7	arpana.shrestha36@gmail.com	$2b$10$8ksZoH/0GjWbvbkDWGly8eNp.9kcAetpwpQZ4ESUwMGk7UDQAnNC.	Arpana Shrestha	2	t	2026-07-23 09:19:05.612	2026-07-23 09:19:05.612	1
8	koselighar@gmail.com	$2b$10$dIojRSfj/dpy9hrC6MUgmeT375kJSDx.4slMyjo7Qj01Wl/hT2Z46	Melamchi Municipality	2	t	2026-07-24 01:42:16.071	2026-07-24 01:42:16.071	1
9	nirmalthapag@gmail.com	$2b$10$juSfDfL8JMnw4Mz7DjaS8Oq419o8ABKfmuym8uu9WHNw53JI7OF9W	Nirmal Thapa	2	t	2026-07-24 09:35:31.147	2026-07-24 09:35:31.147	1
\.


--
-- Name: Account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Account_id_seq"', 13, true);


--
-- Name: ActivityLog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ActivityLog_id_seq"', 1, false);


--
-- Name: Brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Brand_id_seq"', 2, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 27, true);


--
-- Name: Company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Company_id_seq"', 4, true);


--
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 1, true);


--
-- Name: DeletedSale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DeletedSale_id_seq"', 3, true);


--
-- Name: ExpenseCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ExpenseCategory_id_seq"', 9, true);


--
-- Name: Expense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Expense_id_seq"', 1, false);


--
-- Name: FiscalYear_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."FiscalYear_id_seq"', 2, true);


--
-- Name: IncomeCategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."IncomeCategory_id_seq"', 7, true);


--
-- Name: Income_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Income_id_seq"', 1, false);


--
-- Name: InventoryTransaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."InventoryTransaction_id_seq"', 56, true);


--
-- Name: JournalEntryLine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JournalEntryLine_id_seq"', 1, false);


--
-- Name: JournalEntry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."JournalEntry_id_seq"', 1, false);


--
-- Name: MembershipTier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."MembershipTier_id_seq"', 4, true);


--
-- Name: PaymentTransaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PaymentTransaction_id_seq"', 1, false);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 36, true);


--
-- Name: PurchaseItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PurchaseItem_id_seq"', 44, true);


--
-- Name: PurchaseReturnItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PurchaseReturnItem_id_seq"', 1, false);


--
-- Name: PurchaseReturn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PurchaseReturn_id_seq"', 1, false);


--
-- Name: Purchase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Purchase_id_seq"', 34, true);


--
-- Name: RewardPointHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RewardPointHistory_id_seq"', 2, true);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 3, true);


--
-- Name: SaleItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SaleItem_id_seq"', 4, true);


--
-- Name: SaleReturnItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SaleReturnItem_id_seq"', 1, false);


--
-- Name: SaleReturn_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SaleReturn_id_seq"', 1, false);


--
-- Name: Sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Sale_id_seq"', 4, true);


--
-- Name: Shift_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Shift_id_seq"', 1, false);


--
-- Name: StoreSetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StoreSetting_id_seq"', 4, true);


--
-- Name: Supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Supplier_id_seq"', 27, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 9, true);


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: Brand Brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: DeletedSale DeletedSale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeletedSale"
    ADD CONSTRAINT "DeletedSale_pkey" PRIMARY KEY (id);


--
-- Name: ExpenseCategory ExpenseCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseCategory"
    ADD CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY (id);


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: FiscalYear FiscalYear_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FiscalYear"
    ADD CONSTRAINT "FiscalYear_pkey" PRIMARY KEY (id);


--
-- Name: IncomeCategory IncomeCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IncomeCategory"
    ADD CONSTRAINT "IncomeCategory_pkey" PRIMARY KEY (id);


--
-- Name: Income Income_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Income"
    ADD CONSTRAINT "Income_pkey" PRIMARY KEY (id);


--
-- Name: InventoryTransaction InventoryTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY (id);


--
-- Name: JournalEntryLine JournalEntryLine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntryLine"
    ADD CONSTRAINT "JournalEntryLine_pkey" PRIMARY KEY (id);


--
-- Name: JournalEntry JournalEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_pkey" PRIMARY KEY (id);


--
-- Name: MembershipTier MembershipTier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembershipTier"
    ADD CONSTRAINT "MembershipTier_pkey" PRIMARY KEY (id);


--
-- Name: PaymentTransaction PaymentTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseItem PurchaseItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseReturnItem PurchaseReturnItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturnItem"
    ADD CONSTRAINT "PurchaseReturnItem_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseReturn PurchaseReturn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_pkey" PRIMARY KEY (id);


--
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- Name: RewardPointHistory RewardPointHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RewardPointHistory"
    ADD CONSTRAINT "RewardPointHistory_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: SaleItem SaleItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleItem"
    ADD CONSTRAINT "SaleItem_pkey" PRIMARY KEY (id);


--
-- Name: SaleReturnItem SaleReturnItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturnItem"
    ADD CONSTRAINT "SaleReturnItem_pkey" PRIMARY KEY (id);


--
-- Name: SaleReturn SaleReturn_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturn"
    ADD CONSTRAINT "SaleReturn_pkey" PRIMARY KEY (id);


--
-- Name: Sale Sale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_pkey" PRIMARY KEY (id);


--
-- Name: Shift Shift_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_pkey" PRIMARY KEY (id);


--
-- Name: StoreSetting StoreSetting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StoreSetting"
    ADD CONSTRAINT "StoreSetting_pkey" PRIMARY KEY (id);


--
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Brand_name_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_name_companyId_key" ON public."Brand" USING btree (name, "companyId");


--
-- Name: Brand_slug_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Brand_slug_companyId_key" ON public."Brand" USING btree (slug, "companyId");


--
-- Name: Category_name_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_companyId_key" ON public."Category" USING btree (name, "companyId");


--
-- Name: Customer_email_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_email_companyId_key" ON public."Customer" USING btree (email, "companyId");


--
-- Name: Customer_phone_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_phone_companyId_key" ON public."Customer" USING btree (phone, "companyId");


--
-- Name: ExpenseCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ExpenseCategory_name_key" ON public."ExpenseCategory" USING btree (name);


--
-- Name: FiscalYear_name_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "FiscalYear_name_companyId_key" ON public."FiscalYear" USING btree (name, "companyId");


--
-- Name: IncomeCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IncomeCategory_name_key" ON public."IncomeCategory" USING btree (name);


--
-- Name: PaymentTransaction_saleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentTransaction_saleId_key" ON public."PaymentTransaction" USING btree ("saleId");


--
-- Name: PaymentTransaction_transactionRef_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PaymentTransaction_transactionRef_key" ON public."PaymentTransaction" USING btree ("transactionRef");


--
-- Name: Product_SKU_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_SKU_companyId_key" ON public."Product" USING btree ("SKU", "companyId");


--
-- Name: Product_barcode_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_barcode_companyId_key" ON public."Product" USING btree (barcode, "companyId");


--
-- Name: PurchaseReturn_returnNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "PurchaseReturn_returnNo_key" ON public."PurchaseReturn" USING btree ("returnNo");


--
-- Name: Purchase_poNumber_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Purchase_poNumber_companyId_key" ON public."Purchase" USING btree ("poNumber", "companyId");


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: SaleReturn_returnNo_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SaleReturn_returnNo_key" ON public."SaleReturn" USING btree ("returnNo");


--
-- Name: Sale_invoiceNo_companyId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Sale_invoiceNo_companyId_key" ON public."Sale" USING btree ("invoiceNo", "companyId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Account Account_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ActivityLog ActivityLog_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ActivityLog ActivityLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Brand Brand_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brand"
    ADD CONSTRAINT "Brand_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Category Category_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Customer Customer_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Customer Customer_membershipTierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_membershipTierId_fkey" FOREIGN KEY ("membershipTierId") REFERENCES public."MembershipTier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DeletedSale DeletedSale_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeletedSale"
    ADD CONSTRAINT "DeletedSale_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExpenseCategory ExpenseCategory_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ExpenseCategory"
    ADD CONSTRAINT "ExpenseCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expense Expense_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FiscalYear FiscalYear_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FiscalYear"
    ADD CONSTRAINT "FiscalYear_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: IncomeCategory IncomeCategory_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."IncomeCategory"
    ADD CONSTRAINT "IncomeCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Income Income_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Income"
    ADD CONSTRAINT "Income_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryTransaction InventoryTransaction_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: InventoryTransaction InventoryTransaction_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryTransaction InventoryTransaction_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventoryTransaction InventoryTransaction_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryTransaction"
    ADD CONSTRAINT "InventoryTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JournalEntryLine JournalEntryLine_accountId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntryLine"
    ADD CONSTRAINT "JournalEntryLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES public."Account"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: JournalEntryLine JournalEntryLine_journalEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntryLine"
    ADD CONSTRAINT "JournalEntryLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES public."JournalEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: JournalEntry JournalEntry_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."JournalEntry"
    ADD CONSTRAINT "JournalEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MembershipTier MembershipTier_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MembershipTier"
    ADD CONSTRAINT "MembershipTier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentTransaction PaymentTransaction_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaymentTransaction PaymentTransaction_saleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PaymentTransaction"
    ADD CONSTRAINT "PaymentTransaction_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public."Sale"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brand"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseItem PurchaseItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseItem PurchaseItem_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseReturnItem PurchaseReturnItem_purchaseItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturnItem"
    ADD CONSTRAINT "PurchaseReturnItem_purchaseItemId_fkey" FOREIGN KEY ("purchaseItemId") REFERENCES public."PurchaseItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseReturnItem PurchaseReturnItem_purchaseReturnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturnItem"
    ADD CONSTRAINT "PurchaseReturnItem_purchaseReturnId_fkey" FOREIGN KEY ("purchaseReturnId") REFERENCES public."PurchaseReturn"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PurchaseReturn PurchaseReturn_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseReturn PurchaseReturn_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseReturn PurchaseReturn_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseReturn"
    ADD CONSTRAINT "PurchaseReturn_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Purchase Purchase_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Purchase Purchase_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RewardPointHistory RewardPointHistory_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RewardPointHistory"
    ADD CONSTRAINT "RewardPointHistory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RewardPointHistory RewardPointHistory_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RewardPointHistory"
    ADD CONSTRAINT "RewardPointHistory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SaleItem SaleItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleItem"
    ADD CONSTRAINT "SaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SaleItem SaleItem_saleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleItem"
    ADD CONSTRAINT "SaleItem_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public."Sale"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SaleReturnItem SaleReturnItem_saleItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturnItem"
    ADD CONSTRAINT "SaleReturnItem_saleItemId_fkey" FOREIGN KEY ("saleItemId") REFERENCES public."SaleItem"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SaleReturnItem SaleReturnItem_saleReturnId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturnItem"
    ADD CONSTRAINT "SaleReturnItem_saleReturnId_fkey" FOREIGN KEY ("saleReturnId") REFERENCES public."SaleReturn"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SaleReturn SaleReturn_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturn"
    ADD CONSTRAINT "SaleReturn_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SaleReturn SaleReturn_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturn"
    ADD CONSTRAINT "SaleReturn_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SaleReturn SaleReturn_saleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SaleReturn"
    ADD CONSTRAINT "SaleReturn_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES public."Sale"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sale Sale_cashierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sale Sale_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Sale Sale_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Sale"
    ADD CONSTRAINT "Sale_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Shift Shift_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Shift Shift_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Shift"
    ADD CONSTRAINT "Shift_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StoreSetting StoreSetting_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."StoreSetting"
    ADD CONSTRAINT "StoreSetting_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Supplier Supplier_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 2ENzUKkkcMSD10uAnFn10pX9LaEWcWhMFiN0mKwGrqyZKbgHG4j7MhkAb7kvXpu

