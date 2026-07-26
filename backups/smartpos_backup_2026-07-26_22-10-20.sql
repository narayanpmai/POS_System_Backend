--
-- PostgreSQL database dump
--

\restrict Wu8k3NON5GFeL6YbkKjqRwGGuNIko3B7TUTx6foTlMfzCT6NcpFisgLgXPcHfjV

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

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


ALTER SEQUENCE public."Account_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."ActivityLog_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Brand_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Category_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Company_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Customer_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."DeletedSale_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."ExpenseCategory_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Expense_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."FiscalYear_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."IncomeCategory_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Income_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."InventoryTransaction_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."JournalEntryLine_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."JournalEntry_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."MembershipTier_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."PaymentTransaction_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Product_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."PurchaseItem_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."PurchaseReturnItem_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."PurchaseReturn_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Purchase_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."RewardPointHistory_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Role_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."SaleItem_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."SaleReturnItem_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."SaleReturn_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Sale_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Shift_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."StoreSetting_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."Supplier_id_seq" OWNER TO postgres;

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


ALTER SEQUENCE public."User_id_seq" OWNER TO postgres;

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
1	1000	Cash	ASSET	0	\N	1
2	1010	Bank	ASSET	0	\N	1
3	1200	Accounts Receivable	ASSET	0	\N	1
4	1300	Inventory	ASSET	0	\N	1
5	2000	Accounts Payable	LIABILITY	0	\N	1
6	2100	Sales Tax Payable	LIABILITY	0	\N	1
7	3000	Owner Equity	EQUITY	0	\N	1
8	4000	Sales Revenue	REVENUE	0	\N	1
9	4100	Service Revenue	REVENUE	0	\N	1
10	5000	Cost of Goods Sold (COGS)	EXPENSE	0	\N	1
11	6000	Rent Expense	EXPENSE	0	\N	1
12	6100	Utilities Expense	EXPENSE	0	\N	1
13	6200	Payroll Expense	EXPENSE	0	\N	1
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
4	स्थानीय उत्पादन	-	ACTIVE	2026-07-26 16:23:16.714	2026-07-26 16:23:16.714	2
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, description, "createdAt", "updatedAt", "companyId") FROM stdin;
1	Fresh Produce	Fresh fruits and vegetables	2026-07-26 15:51:41.95	2026-07-26 15:51:41.95	1
2	Dairy & Eggs	Milk, cheese, butter, and eggs	2026-07-26 15:51:41.953	2026-07-26 15:51:41.953	1
3	Meat & Seafood	Fresh and frozen meat, poultry, and seafood	2026-07-26 15:51:41.955	2026-07-26 15:51:41.955	1
4	Bakery & Breads	Fresh baked breads, pastries, and cakes	2026-07-26 15:51:41.956	2026-07-26 15:51:41.956	1
5	Beverages	Juices, soft drinks, water, tea, and coffee	2026-07-26 15:51:41.96	2026-07-26 15:51:41.96	1
6	Snacks & Sweets	Chips, chocolates, candies, and cookies	2026-07-26 15:51:41.961	2026-07-26 15:51:41.961	1
7	Pantry Staples	Rice, flour, pasta, oils, spices, and sauces	2026-07-26 15:51:41.962	2026-07-26 15:51:41.962	1
8	Frozen Foods	Frozen meals, vegetables, and ice cream	2026-07-26 15:51:41.963	2026-07-26 15:51:41.963	1
9	Canned Goods	Canned beans, soups, and vegetables	2026-07-26 15:51:41.964	2026-07-26 15:51:41.964	1
10	Personal Care	Soap, shampoo, toothpaste, and hygiene products	2026-07-26 15:51:41.965	2026-07-26 15:51:41.965	1
11	Household & Cleaning	Detergents, cleaners, and paper products	2026-07-26 15:51:41.966	2026-07-26 15:51:41.966	1
12	Baby Items	Baby food, diapers, and baby care	2026-07-26 15:51:41.967	2026-07-26 15:51:41.967	1
13	Organic Fresh Produce	Certified organic fruits and vegetables	2026-07-26 15:51:41.967	2026-07-26 15:51:41.967	1
14	Organic Dairy	Organic milk, cheese, and butter	2026-07-26 15:51:41.968	2026-07-26 15:51:41.968	1
15	Organic Meat & Poultry	Organic and free-range meat	2026-07-26 15:51:41.969	2026-07-26 15:51:41.969	1
16	Organic Pantry Staples	Organic grains, pulses, and spices	2026-07-26 15:51:41.97	2026-07-26 15:51:41.97	1
17	Organic Snacks	Healthy and organic snacking options	2026-07-26 15:51:41.971	2026-07-26 15:51:41.971	1
18	Organic Beverages	Organic juices, teas, and coffees	2026-07-26 15:51:41.971	2026-07-26 15:51:41.971	1
19	Organic Baby Food	Organic purees and snacks for babies	2026-07-26 15:51:41.972	2026-07-26 15:51:41.972	1
20	Vegan & Plant-Based	Plant-based meat and dairy alternatives	2026-07-26 15:51:41.973	2026-07-26 15:51:41.973	1
27	खाद्यान्न 		2026-07-26 16:23:16.69	2026-07-26 16:23:16.69	2
28	तरकारी जन्य सामाग्री		2026-07-26 16:23:16.703	2026-07-26 16:23:16.703	2
29	सरसफाइ जन्य सामाग्री		2026-07-26 16:23:16.705	2026-07-26 16:23:16.705	2
30	चप्पल		2026-07-26 16:23:16.706	2026-07-26 16:23:16.706	2
31	सजावटको सामान		2026-07-26 16:23:16.709	2026-07-26 16:23:16.709	2
32	ढाकाको सामाग्री		2026-07-26 16:23:16.711	2026-07-26 16:23:16.711	2
33	अचार		2026-07-26 16:23:16.712	2026-07-26 16:23:16.712	2
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Company" (id, name, email, phone, address, logo, "isActive", "createdAt", "updatedAt") FROM stdin;
1	SmartPOS Default Company	admin@smartpos.com	+1 (555) 000-0000	123 Smart Way	\N	t	2026-07-26 15:51:41.541	2026-07-26 15:51:41.541
2	Melamchi KoseliGhar	melamchi@koselighar.com	9856542122	Melamchi Bazaar, Sindhupalchok	\N	t	2026-07-26 15:54:52.386	2026-07-26 15:54:52.386
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
1	Rent & Lease	Store or warehouse rent and lease payments	2026-07-26 15:51:41.974	2026-07-26 15:51:41.974	1
2	Utilities	Electricity, water, internet, and phone bills	2026-07-26 15:51:41.977	2026-07-26 15:51:41.977	1
3	Salaries & Wages	Employee salaries, wages, and bonuses	2026-07-26 15:51:41.978	2026-07-26 15:51:41.978	1
4	Marketing & Advertising	Promotions, ads, and marketing materials	2026-07-26 15:51:41.979	2026-07-26 15:51:41.979	1
5	Maintenance & Repairs	Equipment and facility maintenance	2026-07-26 15:51:41.98	2026-07-26 15:51:41.98	1
6	Office Supplies	Stationery, printing, and general office items	2026-07-26 15:51:41.981	2026-07-26 15:51:41.981	1
7	Logistics & Transportation	Shipping, delivery, and fuel costs	2026-07-26 15:51:41.981	2026-07-26 15:51:41.981	1
8	Taxes & Licenses	Government taxes, permits, and license fees	2026-07-26 15:51:41.982	2026-07-26 15:51:41.982	1
9	Miscellaneous	Other unclassified expenses	2026-07-26 15:51:41.983	2026-07-26 15:51:41.983	1
\.


--
-- Data for Name: FiscalYear; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FiscalYear" (id, name, "startDate", "endDate", "isActive", "createdAt", "updatedAt", "companyId") FROM stdin;
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
1	Sales Revenue	Income from direct product sales	2026-07-26 15:51:41.984	2026-07-26 15:51:41.984	1
2	Service Charge	Income from services, repairs, or delivery	2026-07-26 15:51:42.016	2026-07-26 15:51:42.016	1
3	Wholesale Income	Income from bulk wholesale orders	2026-07-26 15:51:42.018	2026-07-26 15:51:42.018	1
4	Export Income	Income from exported goods	2026-07-26 15:51:42.02	2026-07-26 15:51:42.02	1
5	Commission Income	Commissions earned from third-party products	2026-07-26 15:51:42.022	2026-07-26 15:51:42.022	1
6	Rental Income	Income from renting out equipment or space	2026-07-26 15:51:42.023	2026-07-26 15:51:42.023	1
7	Miscellaneous Income	Other unclassified income sources	2026-07-26 15:51:42.024	2026-07-26 15:51:42.024	1
\.


--
-- Data for Name: InventoryTransaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryTransaction" (id, "productId", type, quantity, reason, "supplierId", "userId", "createdAt", "companyId") FROM stdin;
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
1	Bronze	0	0	1
2	Silver	500	2.5	1
3	Gold	2000	5	1
4	Platinum	5000	10	1
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
7	ताइचिन चिउरा 	Taichin Beaten Rice	284299665861	\N	160	140	10	5	kg	27	4	0	\N	2026-07-26 16:23:16.757	2026-07-26 16:23:16.757	2
8	आलु	potato	505835957333	\N	60	50	0	5	kg	27	4	0	\N	2026-07-26 16:23:16.764	2026-07-26 16:23:16.764	2
9	अदुवा 	aduwa	889373383082	\N	0.2	0.16	1	5	gram	27	4	0	\N	2026-07-26 16:23:16.766	2026-07-26 16:23:16.766	2
10	लसुन	lasun	537996370151	\N	260	200	6.5	5	kg	27	4	0	\N	2026-07-26 16:23:16.768	2026-07-26 16:23:16.768	2
11	डल सानो 	Small 	356983861822	\N	400	350	1	5	pcs	31	4	0	\N	2026-07-26 16:23:16.771	2026-07-26 16:23:16.771	2
12	डल ठुलो 	Doll BIG	743201682285	\N	600	520	2	5	pcs	31	4	0	\N	2026-07-26 16:23:16.773	2026-07-26 16:23:16.773	2
13	कुसन ठुलो 	kushan Big	399414219882	\N	300	250	2	5	pcs	31	4	0	\N	2026-07-26 16:23:16.775	2026-07-26 16:23:16.775	2
14	कुसन सानो	kushan Small	064456526603	\N	250	220	2	5	pcs	31	4	0	\N	2026-07-26 16:23:16.777	2026-07-26 16:23:16.777	2
15	हारपिक	Harpick	554620902717	\N	100	90	9	5	pcs	29	4	0	\N	2026-07-26 16:23:16.778	2026-07-26 16:23:16.778	2
16	झोल साबन	Soap	952885821337	\N	100	90	10	5	pcs	29	4	0	\N	2026-07-26 16:23:16.78	2026-07-26 16:23:16.78	2
17	किरिङ	keyring	848128246532	\N	65	50	13	1	kg	31	4	0	\N	2026-07-26 16:23:16.781	2026-07-26 16:23:16.781	2
18	टिमुर	Timur	350715922889	\N	120	90	502.5	3	pack	27	4	0	\N	2026-07-26 16:23:16.783	2026-07-26 16:23:16.783	2
19	गहुँको पिठो 	gahu ko pitho	447731117233	\N	90	70	4	5	kg	27	4	0	\N	2026-07-26 16:23:16.784	2026-07-26 16:23:16.784	2
20	भटमास	Bhatmas	168778887212	\N	150	140	9.5	5	kg	27	4	0	\N	2026-07-26 16:23:16.786	2026-07-26 16:23:16.786	2
21	खुमल ४	khumalchar	998383168082	\N	135	115	100	5	kg	27	4	0	\N	2026-07-26 16:23:16.787	2026-07-26 16:23:16.787	2
22	बाटेको धुप	bateko dhup	228294444300	\N	95	80	35	5	pack	31	4	0	\N	2026-07-26 16:23:16.789	2026-07-26 16:23:16.789	2
23	सातु पिठो 	Satu Pitho	498543408132	\N	400	360	3.9	5	kg	27	4	0	\N	2026-07-26 16:23:16.79	2026-07-26 16:23:16.79	2
24	मुलाको अचार	mulako achar	977566251872	\N	160	145	10	5	kg	33	4	0	\N	2026-07-26 16:23:16.792	2026-07-26 16:23:16.792	2
25	टिमुर अचार	Timur achar 	876019499788	\N	275	250	10	2	box	33	4	0	\N	2026-07-26 16:23:16.794	2026-07-26 16:23:16.794	2
26	मेथिको अचार	methi achar	918261600710	\N	295	270	20	3	pcs	33	4	0	\N	2026-07-26 16:23:16.796	2026-07-26 16:23:16.796	2
27	मकैको चिउरा 	मकैको चिउरा 	200617585676	\N	150	125	26	5	kg	27	4	0	\N	2026-07-26 16:23:16.798	2026-07-26 16:23:16.798	2
28	रातो चिउरा 	Red Beaten Rice	567130746225	\N	140	115	20	5	kg	27	4	0	\N	2026-07-26 16:23:16.802	2026-07-26 16:23:16.802	2
29	तोरिको तेल	toriko tel	113103259651	\N	375	350	1	5	liter	27	4	0	\N	2026-07-26 16:23:16.804	2026-07-26 16:23:16.804	2
30	ब्राउन चामल	Brown Rice	730357578753	\N	130	110	19	5	kg	27	4	0	\N	2026-07-26 16:23:16.806	2026-07-26 16:23:16.806	2
31	बासमती चामल	Basmati Chamal	935819952182	\N	215	195	25	5	kg	27	4	0	\N	2026-07-26 16:23:16.807	2026-07-26 16:23:16.807	2
32	लोकल सिमी 	simi local	688665310381	\N	185	150	52	5	kg	27	4	0	\N	2026-07-26 16:23:16.809	2026-07-26 16:23:16.809	2
33	अदुवा धुलो 	aduwa dhulo	295646953165	\N	50	0.4	500	5	gram	27	4	0	\N	2026-07-26 16:23:16.81	2026-07-26 16:23:16.81	2
34	कोदोको पिठो	kodo 	962080452587	\N	90	70	28.5	3	kg	27	4	0	\N	2026-07-26 16:23:16.811	2026-07-26 16:23:16.811	2
35	सिन्की 	sinki	432023034693	\N	85	75	4	0	gram	27	4	0	\N	2026-07-26 16:23:16.813	2026-07-26 16:23:16.813	2
36	बेसार 	besar 	166543153136	\N	60	35	7	3	kg	27	4	0	\N	2026-07-26 16:23:16.814	2026-07-26 16:23:16.814	2
37	गुन्दुक	Gundruk	311317493759	\N	50	41	2	3	pack	27	4	0	\N	2026-07-26 16:23:16.816	2026-07-26 16:23:16.816	2
38	मकैको पिठो	Makai-01	514570650577	मे.न.पा-12	65	50	32.5	3	kg	27	4	0	\N	2026-07-26 16:23:16.817	2026-07-26 16:23:16.817	2
39	अकबरे अचार	akabare achar	443761076193	\N	300	270	3	5	pcs	33	4	0	\N	2026-07-26 16:23:16.819	2026-07-26 16:23:16.819	2
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Purchase" (id, "poNumber", "supplierId", status, "totalAmount", "purchaseDate", "createdAt", "updatedAt", "userId", "companyId") FROM stdin;
3	PUR-384396330	3	RECEIVED	250	2026-07-23 07:12:15.738	2026-07-26 16:23:16.827	2026-07-26 16:23:16.827	1	2
4	PUR-44939438	18	RECEIVED	140	2026-07-23 10:55:35.023	2026-07-26 16:23:16.84	2026-07-26 16:23:16.84	1	2
5	PUR-743593508	26	RECEIVED	975	2026-07-24 02:42:48.39	2026-07-26 16:23:16.843	2026-07-26 16:23:16.843	1	2
6	PUR-922743419	25	RECEIVED	350	2026-07-24 02:43:22.541	2026-07-26 16:23:16.846	2026-07-26 16:23:16.846	1	2
7	PUR-871292114	25	RECEIVED	1040	2026-07-24 02:43:55.83	2026-07-26 16:23:16.848	2026-07-26 16:23:16.848	1	2
8	PUR-91004431	25	RECEIVED	500	2026-07-24 02:44:31.381	2026-07-26 16:23:16.851	2026-07-26 16:23:16.851	1	2
9	PUR-22804660	25	RECEIVED	440	2026-07-24 02:44:52.805	2026-07-26 16:23:16.854	2026-07-26 16:23:16.854	1	2
10	PUR-102266537	24	RECEIVED	1710	2026-07-24 02:45:55.494	2026-07-26 16:23:16.856	2026-07-26 16:23:16.856	1	2
11	PUR-881953402	23	RECEIVED	650	2026-07-24 02:46:20.757	2026-07-26 16:23:16.86	2026-07-26 16:23:16.86	1	2
12	PUR-664427907	21	RECEIVED	160	2026-07-24 02:50:27.156	2026-07-26 16:23:16.862	2026-07-26 16:23:16.862	1	2
13	PUR-9109603	20	RECEIVED	1300	2026-07-24 02:51:41.948	2026-07-26 16:23:16.866	2026-07-26 16:23:16.866	1	2
14	PUR-234785596	19	RECEIVED	280	2026-07-24 02:52:15.237	2026-07-26 16:23:16.869	2026-07-26 16:23:16.869	1	2
15	PUR-946530222	18	RECEIVED	1330	2026-07-24 02:52:59.941	2026-07-26 16:23:16.871	2026-07-26 16:23:16.871	1	2
16	PUR-604812690	17	RECEIVED	11500	2026-07-24 02:53:38.1	2026-07-26 16:23:16.873	2026-07-26 16:23:16.873	1	2
17	PUR-349287153	16	RECEIVED	2800	2026-07-24 02:54:13.58	2026-07-26 16:23:16.876	2026-07-26 16:23:16.876	1	2
18	PUR-293507621	15	RECEIVED	840	2026-07-24 02:54:57.453	2026-07-26 16:23:16.878	2026-07-26 16:23:16.878	1	2
19	PUR-627761806	14	RECEIVED	1404	2026-07-24 02:55:42.291	2026-07-26 16:23:16.88	2026-07-26 16:23:16.88	1	2
20	PUR-744225865	10	RECEIVED	9350	2026-07-24 02:57:05.556	2026-07-26 16:23:16.884	2026-07-26 16:23:16.884	1	2
21	PUR-947921797	11	RECEIVED	7300	2026-07-24 02:59:06.419	2026-07-26 16:23:16.887	2026-07-26 16:23:16.887	1	2
22	PUR-739981742	13	RECEIVED	2090	2026-07-24 02:59:52.908	2026-07-26 16:23:16.89	2026-07-26 16:23:16.89	1	2
23	PUR-619367632	12	RECEIVED	4875	2026-07-24 03:00:18.803	2026-07-26 16:23:16.893	2026-07-26 16:23:16.893	1	2
24	PUR-962193075	9	RECEIVED	7800	2026-07-24 03:00:55.532	2026-07-26 16:23:16.896	2026-07-26 16:23:16.896	1	2
25	PUR-10984758	7	RECEIVED	41	2026-07-24 03:02:17.9	2026-07-26 16:23:16.898	2026-07-26 16:23:16.898	1	2
26	PUR-17964480	6	RECEIVED	1995	2026-07-24 03:02:37.18	2026-07-26 16:23:16.901	2026-07-26 16:23:16.901	1	2
27	PUR-682420062	8	RECEIVED	300	2026-07-24 03:03:07.507	2026-07-26 16:23:16.903	2026-07-26 16:23:16.903	1	2
28	PUR-151657616	5	RECEIVED	245	2026-07-24 03:04:34.627	2026-07-26 16:23:16.906	2026-07-26 16:23:16.906	1	2
29	PUR-269039489	4	RECEIVED	41	2026-07-24 03:05:15.027	2026-07-26 16:23:16.908	2026-07-26 16:23:16.908	1	2
30	PUR-258388909	3	RECEIVED	225	2026-07-24 03:05:52.611	2026-07-26 16:23:16.911	2026-07-26 16:23:16.911	1	2
31	PUR-53661194	2	RECEIVED	600	2026-07-24 03:06:17.57	2026-07-26 16:23:16.914	2026-07-26 16:23:16.914	1	2
32	PUR-397654339	22	RECEIVED	200	2026-07-24 04:26:14.689	2026-07-26 16:23:16.917	2026-07-26 16:23:16.917	1	2
\.


--
-- Data for Name: PurchaseItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseItem" (id, "purchaseId", "productId", quantity, "measurementUnit", "costPrice", total) FROM stdin;
3	3	18	500	gram	0.5	250
4	4	38	1	kg	140	140
5	5	38	19.5	kg	50	975
6	6	11	1	pcs	350	350
7	7	12	2	pcs	520	1040
8	8	13	2	pcs	250	500
9	9	14	2	pcs	220	440
10	10	15	9	pcs	90	810
11	10	16	10	pcs	90	900
12	11	17	13	kg	50	650
13	12	9	1	kg	160	160
14	13	10	6.5	kg	200	1300
15	14	19	4	kg	70	280
16	15	20	9.5	kg	140	1330
17	16	21	100	kg	115	11500
18	17	22	35	pack	80	2800
19	18	39	3	pcs	280	840
20	19	23	3.9	kg	360	1404
21	20	24	10	kg	145	1450
22	20	25	10	box	250	2500
23	20	26	20	pcs	270	5400
24	21	7	10	kg	140	1400
25	21	27	26	kg	125	3250
26	21	28	20	kg	115	2300
27	21	29	1	liter	350	350
28	22	30	19	kg	110	2090
29	23	31	25	kg	195	4875
30	24	32	52	kg	150	7800
31	25	37	1	pack	41	41
32	26	34	28.5	kg	70	1995
33	27	35	4	gram	75	300
34	28	36	7	kg	35	245
35	29	37	1	pack	41	41
36	30	18	2.5	pack	90	225
37	31	38	12	kg	50	600
38	32	33	500	gram	0.4	200
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
1	Antigravity Hyper POS	100 Galaxy Way, Suite 2026, Silicon Valley, CA	+1 (555) 767-2026	sales@antigravitypos.com	VAT-US-202605	Rs.	Welcome to Antigravity SmartPOS!	Thank you! Hope to see you again soon.	12	PTRM	2026-07-26 15:51:41.61	1
\.


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Supplier" (id, name, "contactName", email, phone, address, "createdAt", "updatedAt", "companyId") FROM stdin;
2	दावा लमिनी तामाङ	\N	\N	\N	मे.न.पा- 12	2026-07-26 16:23:16.717	2026-07-26 16:23:16.717	2
3	होम बहादुर तामाङ 	\N	\N	\N	मे.न.पा.-9	2026-07-26 16:23:16.72	2026-07-26 16:23:16.72	2
4	मथुरा सापकोटा 	\N	\N	\N	मे.न. पा -11	2026-07-26 16:23:16.722	2026-07-26 16:23:16.722	2
5	सानुकान्छा तामाङ 	\N	\N	\N	\N	2026-07-26 16:23:16.723	2026-07-26 16:23:16.723	2
6	राजकुमार सार्की 	\N	\N	\N	\N	2026-07-26 16:23:16.724	2026-07-26 16:23:16.724	2
7	तारा सापकोटा 	\N	\N	\N	\N	2026-07-26 16:23:16.726	2026-07-26 16:23:16.726	2
8	रामकृष्ण पुरी 	\N	\N	\N	\N	2026-07-26 16:23:16.727	2026-07-26 16:23:16.727	2
9	विरमान तामाङ 	\N	\N	\N	\N	2026-07-26 16:23:16.728	2026-07-26 16:23:16.728	2
10	सीता पौड्याल	\N	\N	\N	\N	2026-07-26 16:23:16.73	2026-07-26 16:23:16.73	2
11	परमेश्वर न्यौपाने	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.731	2026-07-26 16:23:16.731	2
12	उत्तम गिरी 	\N	\N	\N	\N	2026-07-26 16:23:16.732	2026-07-26 16:23:16.732	2
13	तारा श्रेष्ठ	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.733	2026-07-26 16:23:16.733	2
14	रञ्जु श्रेष्ठ	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.734	2026-07-26 16:23:16.734	2
15	सुजना श्रेष्ठ	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.736	2026-07-26 16:23:16.736	2
16	जुना कुँवर	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.738	2026-07-26 16:23:16.738	2
17	छत्र बा. अर्याल	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.741	2026-07-26 16:23:16.741	2
18	ओम कुमारी विष्ट	\N	\N	\N	मे.न. पा	2026-07-26 16:23:16.742	2026-07-26 16:23:16.742	2
19	ठाकुर ढंगाना 	\N	\N	\N	\N	2026-07-26 16:23:16.744	2026-07-26 16:23:16.744	2
20	सिता रावल	\N	\N	\N	\N	2026-07-26 16:23:16.746	2026-07-26 16:23:16.746	2
21	राजन कार्की 	\N	\N	\N	\N	2026-07-26 16:23:16.747	2026-07-26 16:23:16.747	2
22	लक्ष्मी नारायण तिवारी 	\N	\N	\N	\N	2026-07-26 16:23:16.748	2026-07-26 16:23:16.748	2
23	ज्यास्मी खड्का 	\N	\N	\N	\N	2026-07-26 16:23:16.75	2026-07-26 16:23:16.75	2
24	दिपक भुजेल	\N	\N	\N	\N	2026-07-26 16:23:16.751	2026-07-26 16:23:16.751	2
25	विन्दा खड्का	\N	\N	\N	\N	2026-07-26 16:23:16.753	2026-07-26 16:23:16.753	2
26	सिवराज घले	\N	\N	\N	\N	2026-07-26 16:23:16.754	2026-07-26 16:23:16.754	2
27	कान्छिमाया तामाङ 	\N	\N	\N	\N	2026-07-26 16:23:16.756	2026-07-26 16:23:16.756	2
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, email, password, name, "roleId", active, "createdAt", "updatedAt", "companyId") FROM stdin;
1	admin@pos.com	$2b$10$sOxl1mDIIbviGQyZTccfDOpIoA4fXBFDGy44N3QZ1CAtxNj0fG4mG	Super Admin User	1	t	2026-07-26 15:51:41.945	2026-07-26 15:51:41.945	1
2	cashier@pos.com	$2b$10$sOxl1mDIIbviGQyZTccfDO/QVWtGk1y.rWmOAqFHJnUlFBm7bWQpm	Cashier Emma	3	t	2026-07-26 15:51:41.949	2026-07-26 15:51:41.949	1
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

SELECT pg_catalog.setval('public."Brand_id_seq"', 4, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 33, true);


--
-- Name: Company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Company_id_seq"', 2, true);


--
-- Name: Customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Customer_id_seq"', 1, false);


--
-- Name: DeletedSale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."DeletedSale_id_seq"', 1, false);


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

SELECT pg_catalog.setval('public."FiscalYear_id_seq"', 1, false);


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

SELECT pg_catalog.setval('public."InventoryTransaction_id_seq"', 1, false);


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

SELECT pg_catalog.setval('public."Product_id_seq"', 39, true);


--
-- Name: PurchaseItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."PurchaseItem_id_seq"', 38, true);


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

SELECT pg_catalog.setval('public."Purchase_id_seq"', 32, true);


--
-- Name: RewardPointHistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RewardPointHistory_id_seq"', 1, false);


--
-- Name: Role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Role_id_seq"', 3, true);


--
-- Name: SaleItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."SaleItem_id_seq"', 1, false);


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

SELECT pg_catalog.setval('public."Sale_id_seq"', 1, false);


--
-- Name: Shift_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Shift_id_seq"', 1, false);


--
-- Name: StoreSetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."StoreSetting_id_seq"', 1, true);


--
-- Name: Supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Supplier_id_seq"', 27, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 2, true);


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
-- PostgreSQL database dump complete
--

\unrestrict Wu8k3NON5GFeL6YbkKjqRwGGuNIko3B7TUTx6foTlMfzCT6NcpFisgLgXPcHfjV

