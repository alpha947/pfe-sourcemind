--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: confirmations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.confirmations (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    reference_id character varying(255),
    updated_at timestamp(6) without time zone NOT NULL,
    updated_by bigint NOT NULL,
    key character varying(255),
    user_id bigint NOT NULL
);


ALTER TABLE public.confirmations OWNER TO postgres;

--
-- Name: credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credentials (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    reference_id character varying(255),
    updated_at timestamp(6) without time zone NOT NULL,
    updated_by bigint NOT NULL,
    password character varying(255),
    user_id bigint NOT NULL
);


ALTER TABLE public.credentials OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    reference_id character varying(255),
    updated_at timestamp(6) without time zone NOT NULL,
    updated_by bigint NOT NULL,
    description character varying(255),
    document_id character varying(255) NOT NULL,
    extension character varying(255),
    formatted_size character varying(255),
    icon character varying(255),
    name character varying(255),
    size bigint NOT NULL,
    uri character varying(255),
    user_id bigint
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: primary_key_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.primary_key_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.primary_key_seq OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    reference_id character varying(255),
    updated_at timestamp(6) without time zone NOT NULL,
    updated_by bigint NOT NULL,
    authorities character varying(255),
    name character varying(255)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: service_actuel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_actuel (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    reference_id character varying(255),
    updated_at timestamp(6) without time zone NOT NULL,
    updated_by bigint NOT NULL,
    description character varying(255),
    nom_service character varying(255) NOT NULL,
    service_id character varying(255) NOT NULL
);


ALTER TABLE public.service_actuel OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    role_id bigint,
    user_id bigint NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone NOT NULL,
    created_by bigint NOT NULL,
    reference_id character varying(255),
    updated_at timestamp(6) without time zone NOT NULL,
    updated_by bigint NOT NULL,
    account_non_expired boolean NOT NULL,
    account_non_locked boolean NOT NULL,
    bio character varying(255),
    email character varying(255) NOT NULL,
    enabled boolean NOT NULL,
    first_name character varying(255),
    image_url character varying(255),
    last_login timestamp(6) without time zone,
    last_name character varying(255),
    login_attempts integer,
    mfa boolean NOT NULL,
    phone character varying(255),
    qr_code_image_uri text,
    qr_code_secret character varying(255),
    user_id character varying(255) NOT NULL,
    departement character varying(255),
    grade character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_role (
    user_id bigint NOT NULL,
    role_id bigint
);


ALTER TABLE public.users_role OWNER TO postgres;

--
-- Data for Name: confirmations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.confirmations (id, created_at, created_by, reference_id, updated_at, updated_by, key, user_id) FROM stdin;
5	2024-07-03 14:14:50.263829	0	e4e20ba4-63a8-d0df-7c95-428a84506217	2024-07-03 14:14:50.263829	0	561d5253-d458-41fe-95a0-994647119903	3
19	2024-07-03 17:02:41.409074	0	236add99-bcef-a11d-48ca-2a1abd98404f	2024-07-03 17:02:41.409074	0	0388a348-5330-4ae6-92c4-a110891764a2	17
22	2024-07-04 12:26:16.702098	0	f24495ed-1d24-dffe-5c14-8f3ed229008c	2024-07-04 12:26:16.702187	0	98071654-51ef-4f2c-9b65-ac562b75b6fc	20
25	2024-07-04 12:28:43.874653	0	f0c46e30-2ecf-6be6-fb9e-2dbae4055daa	2024-07-04 12:28:43.874653	0	cbecce5d-b183-448b-a02f-a4517ff144c2	23
28	2024-07-04 12:33:54.406945	0	ee7fccb6-b237-0b94-451a-53328e81c4bb	2024-07-04 12:33:54.406945	0	ec41d17e-b687-4065-be42-1ad2d96813fc	26
31	2024-07-04 13:25:20.610185	0	11e57aca-f0cb-0b2c-fe8b-39792be0b4c4	2024-07-04 13:25:20.610185	0	c84af585-02be-4ebd-bf04-1c51f051355b	29
34	2024-07-06 14:21:28.017923	0	a6d32d84-8cc0-c504-1e62-75b8d75ab700	2024-07-06 14:21:28.017923	0	79fddad6-b577-4536-bdd7-2559505c7c4f	32
40	2024-07-06 14:26:41.336292	0	cdd19513-e027-cad1-4337-cdea6c310012	2024-07-06 14:26:41.336292	0	b788d6e1-9197-4eeb-8a83-aee7ec2b2bf0	38
43	2024-07-06 14:33:46.65677	0	538f2f01-9fdc-baa4-01fa-9c043ba6f0e6	2024-07-06 14:33:46.65677	0	c4d0d696-1a92-4f81-bcfd-eef06af5f604	41
\.


--
-- Data for Name: credentials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credentials (id, created_at, created_by, reference_id, updated_at, updated_by, password, user_id) FROM stdin;
4	2024-07-03 14:14:50.231787	0	c8cc818a-8ed6-4959-15ba-95e257aa16fb	2024-07-03 14:14:50.231787	0	$2a$12$ilwFPC74Z1OdKhoI.XL38OwD2h2LyLfnjdBj1XggHNWutF5L8VFPy	3
18	2024-07-03 17:02:41.405073	0	9e44446f-31c1-d0e8-1241-3af33a7be1f8	2024-07-03 17:02:41.405073	0	$2a$12$qSR34CwUg9DSrZkXYY8x6u86fwzWf/pnq33iECzjMZGgo5TlqqqBS	17
21	2024-07-04 12:26:16.694192	0	4829cf85-322d-3f51-983e-9f68afb4b01d	2024-07-04 12:26:16.694192	0	$2a$12$mR2CVBKfmlXkLFBxns8uhORpuxX7tHMjlH9wCPerEx01ay1fhyXKK	20
24	2024-07-04 12:28:43.861661	0	574481bd-c6eb-9c8e-845b-2c4f39427fc8	2024-07-04 12:28:43.861661	0	$2a$12$vSMEIgyzF3cconK2a3A1HOPN8lhjQqIjFsEdIb67.azit71dcEuS6	23
27	2024-07-04 12:33:54.399948	0	b8871714-222a-9586-48a8-01c6c0986ce4	2024-07-04 12:33:54.399948	0	$2a$12$xYG6OUJZin3L4Qml.1TTKOCs.2.uWyIc74emFFTJEuJtjaB2WcDy.	26
30	2024-07-04 13:25:20.608578	0	8e7b345d-e4d8-9143-8611-bab327a824b3	2024-07-04 13:25:20.608578	0	$2a$12$YU.gurRrRG2ELYIf1wrZB.gBLObmpC3T62IXzgoSGyKWa2F692.kW	29
33	2024-07-06 14:21:28.010386	0	783d4e33-baca-2834-f0b8-1c0992a3cc8c	2024-07-06 14:21:28.010386	0	$2a$12$hmvnCOjkyUfuCSmnyoyMsOPsnnuZ/1p6lz13TSUJxLWL5Yz2uI8oi	32
39	2024-07-06 14:26:41.335785	0	585e52da-7513-05ca-ee60-b5fc48254021	2024-07-06 14:26:41.335785	0	$2a$12$7ca6Ht/wrUqybF7bhcK76e77w4KkQHsjEZuKXKaC5FvkkZBk2Ft9W	38
42	2024-07-06 14:33:46.644776	0	b098b36b-e31b-6f90-a01d-09dae759f348	2024-07-06 14:33:46.644776	0	$2a$12$8ZVFwI5I8BAH0UZ4ElD0pOUawg3YjAHuaHcCRVJgvrTq89Vfwvsy6	41
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, created_at, created_by, reference_id, updated_at, updated_by, description, document_id, extension, formatted_size, icon, name, size, uri, user_id) FROM stdin;
13	2024-07-03 15:22:37.968946	3	0c3cefcc-0c37-6e96-b0e3-a1325f64765e	2024-07-03 15:22:37.968946	3	\N	80851536-1daf-46be-bbc4-0ef053bcc014	xlsx	105 KB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/excel-icon.svg	Situation des importation de RAYWAY 2022.xlsx	0	http://localhost:8085/documents/Situation%20des%20importation%20de%20RAYWAY%202022.xlsx	3
14	2024-07-03 15:23:17.954992	3	a6286117-b741-4807-b182-1a1c60aa6963	2024-07-03 15:23:17.954992	3	\N	c7f273d5-7124-482c-8d72-6f2b9c3bd9a7	pptx	5 MB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/word-icon.svg	Spring I_O 2024 - Flexible Spring with Event Sourcing.pptx	0	http://localhost:8085/documents/Spring%20I_O%202024%20-%20Flexible%20Spring%20with%20Event%20Sourcing.pptx	3
15	2024-07-03 16:21:44.840697	3	5340e310-7265-3f2c-1d18-9c504c8a95ac	2024-07-03 16:22:36.10986	3	c'est lors de la derniere modification	2120fd01-17ea-4608-b906-9e13f5a821dd	jpg	92 KB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/word-icon.svg	image de test.jpg	0	http://localhost:8085/documents/WhatsApp%20Image%202023-11-23%20%C3%A0%2013.26.13_956e49ab.jpg	3
11	2024-07-03 15:10:48.521101	3	5b5aeb77-0955-e936-eda0-153d0b1edf42	2024-07-03 17:01:34.842199	3	C'est  le premiere document de test sur la plateforme	7acd849a-1b3b-473d-a0e2-c8eda1bae193	pdf	163 KB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/pdf-icon.svg	test de chargement d'un fichier pdf	0	http://localhost:8085/documents/2024-07-03_Annonce%20externe_%20Un%20stagiaire%20en%20d%C3%A9veloppement%20informatique.pdf	3
12	2024-07-03 15:11:14.36925	3	61f35866-5936-3a67-30f0-c028906f9040	2024-07-03 18:39:29.507216	3	c'est un acte reglementaire pour la direction generale des douanes guineenes	2d60d7bc-0c07-4557-9a01-66c8deebffb2	docx	33 KB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/word-icon.svg	Creating Tables.docx	0	http://localhost:8085/documents/Creating%20Tables.docx	3
16	2024-07-03 16:48:16.73337	3	4d75ad7b-6958-cf26-e493-47ec2cc02f39	2024-07-06 12:56:09.564506	17	c'est juste pour vous dire que cet acte reglementaire a ete mis a jour et sa version mise a jour est le fichier "acte reglementaire deployer"	80b3a5b7-d8a4-40d1-b042-2f7f884fcb8d	pdf	207 KB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/pdf-icon.svg	Acte reglementaire.pdf	0	http://localhost:8085/documents/Plan%20BDD.pdf	3
44	2024-07-06 15:11:38.239667	3	4bffebb6-0224-9942-cab9-782c664517f5	2024-07-06 15:13:52.106221	3	cet arrete consiste les exos	69aaf0cd-22e7-4684-95e6-69db800e7a9e	pdf	207 KB	https://htmlstream.com/preview/front-dashboard-v2.1.1/assets/svg/brands/pdf-icon.svg	areté 1771.pdf	0	http://localhost:8085/documents/aret%C3%A9%201771.pdf	3
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, created_at, created_by, reference_id, updated_at, updated_by, authorities, name) FROM stdin;
2	2024-07-03 14:14:20.31923	0	5a019f7f-fee0-1a17-bb0c-b47b800ab173	2024-07-03 14:14:20.31923	0	user:create,user:read,user:update,document:create,document:read,document:update,document:delete	ADMIN
3	2024-07-03 14:14:20.31923	0	5a019f7f-fee0-1a17-bb0c-b47b800ab124	2024-07-03 14:14:20.31923	0	user:create,user:read,user:update,user:delete;document:create,document:read,document:update,document:delete	SUPER_ADMIN
1	2024-07-03 14:14:20.237187	0	0de7dbcc-8c53-d9d8-3c64-f460f29ec451	2024-07-03 14:14:20.237187	0	document:create,document:read	USER
\.


--
-- Data for Name: service_actuel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_actuel (id, created_at, created_by, reference_id, updated_at, updated_by, description, nom_service, service_id) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (role_id, user_id) FROM stdin;
1	20
1	23
1	26
1	29
2	3
2	17
1	32
1	38
1	41
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, created_by, reference_id, updated_at, updated_by, account_non_expired, account_non_locked, bio, email, enabled, first_name, image_url, last_login, last_name, login_attempts, mfa, phone, qr_code_image_uri, qr_code_secret, user_id, departement, grade) FROM stdin;
29	2024-07-04 13:25:19.900311	0	e107b5ff-d01d-c4af-5358-5a10a89eacf2	2024-07-04 13:26:13.489854	29	t	t		mssadiaby@gmail.com	f	Mohamed	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-04 13:25:19.89911	DIABY	1	f		\N		f706cd5d-223d-4eb0-baff-02c93851d478	Direction  Regionale Conakry	colonel
23	2024-07-04 12:28:43.187225	0	fce37f93-761f-022a-527a-df89ed4f2f63	2024-07-04 12:28:43.187225	0	t	t		kouloubekolietest@gmail.com	f	Kouloube	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-04 12:28:43.078576	KOLIE	0	f		\N		37470bc9-8e00-4732-9748-bda895edb2ce	Direction Regionale Conakry Centre	lieutenant colonel
26	2024-07-04 12:33:54.074737	0	fd3bbd10-7502-33f1-9d49-a472c3efe03b	2024-07-04 12:36:39.207021	26	t	t		kouloubekolie@gmail.com	f	Kouloube	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-04 12:33:54.050842	Kolie	1	f		\N		098e7e98-d359-452e-a83e-0105cf7f3767	Direction de la Legislation, de la Reglementation et des Relations Internationales	capitaine
17	2024-07-03 17:02:41.135074	0	f91dcc01-3cdb-5e40-8976-4d0e04a8d4d1	2024-07-06 12:54:44.246368	17	t	t		houdybah@gmail.com	t	Houdy	http://localhost:8085/user/image/c399cc60-205c-42f3-85c2-76ff3716fb4f.png?timestamp=1720089707685	2024-07-06 12:54:44.235367	BAH	0	f		\N		c399cc60-205c-42f3-85c2-76ff3716fb4f	Direction Informatique et Statistique	sous lieutenant
20	2024-07-04 12:26:16.02281	0	71253ee7-a9b8-b32d-ddd6-f9123304fdd2	2024-07-04 12:26:16.02281	0	t	t		camaraousmane@gmail.com	f	Alpha ousmane	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-04 12:26:15.83082	CAMARA	0	f		\N		7807ed1e-32ee-4f2c-a697-4bf3c5853783	Direction Informatique et Statistique	Lieutenant
32	2024-07-06 14:21:27.669798	0	54557d66-5b80-a132-79ff-428010fba41c	2024-07-06 14:21:27.669798	0	t	t		bintoubah555@gmail.com	f	Bintou	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-06 14:21:27.643025	BAH	0	f		\N		78469460-dea4-481f-922e-dc918dd9bb14	\N	\N
38	2024-07-06 14:26:40.940272	0	778ee900-44cd-7239-12f1-6c401c0d757e	2024-07-06 14:26:40.940272	0	t	t		aissataBalde@gmail.com	f	Aissata	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-06 14:26:40.938529	Balde	0	f		\N		8f649f65-0c17-4a2d-aad6-1bf2f4b0316a	\N	\N
41	2024-07-06 14:33:46.240804	0	56305ebd-7e33-6aa2-3aab-2ea930605b12	2024-07-06 14:33:46.240804	0	t	t		aissataBalde1@gmail.com	f	Aissata	https://cdn-icons-png.flaticon.com/512/149/149071.png	2024-07-06 14:33:46.137502	Balde	0	f		\N		e00c31c3-5fa0-472d-a879-25075db60776	\N	\N
3	2024-07-03 14:14:49.910785	0	e4e20ba4-63a8-d0df-7c95-428a84506217	2024-07-06 15:21:00.584247	3	t	t	je suis un developpeur moribond	dialloalphaamadou947@gmail.com	t	Alpha Amadou	http://localhost:8085/user/image/e813212f-bd89-482d-a78c-b7c9869340a2.png?timestamp=1720012235965	2024-07-06 15:17:03.50401	Diallo	0	f	626929178			e813212f-bd89-482d-a78c-b7c9869340a2	Direction Informatique et Statistique	Lieutenant
\.


--
-- Data for Name: users_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_role (user_id, role_id) FROM stdin;
\.


--
-- Name: primary_key_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.primary_key_seq', 44, true);


--
-- Name: confirmations confirmations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmations
    ADD CONSTRAINT confirmations_pkey PRIMARY KEY (id);


--
-- Name: credentials credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT credentials_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: service_actuel service_actuel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_actuel
    ADD CONSTRAINT service_actuel_pkey PRIMARY KEY (id);


--
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: users uk_6efs5vmce86ymf5q7lmvn2uuf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6efs5vmce86ymf5q7lmvn2uuf UNIQUE (user_id);


--
-- Name: documents uk_8bbu7k693ggrqxsui4pujxif7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT uk_8bbu7k693ggrqxsui4pujxif7 UNIQUE (document_id);


--
-- Name: service_actuel uk_a8oiauxaedr3etfuy9nu85gnn; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_actuel
    ADD CONSTRAINT uk_a8oiauxaedr3etfuy9nu85gnn UNIQUE (nom_service);


--
-- Name: service_actuel uk_osony708b7ol8q39xnmuu5kln; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_actuel
    ADD CONSTRAINT uk_osony708b7ol8q39xnmuu5kln UNIQUE (service_id);


--
-- Name: credentials uk_ry431gkw9ueu8xq0yfbys0d1d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT uk_ry431gkw9ueu8xq0yfbys0d1d UNIQUE (user_id);


--
-- Name: confirmations uk_tkafwqdb25datl1g6vactoh6c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmations
    ADD CONSTRAINT uk_tkafwqdb25datl1g6vactoh6c UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_role users_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_role
    ADD CONSTRAINT users_role_pkey PRIMARY KEY (user_id);


--
-- Name: confirmations FK5kovt7ixdn4qlymut3jnnpbu3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.confirmations
    ADD CONSTRAINT "FK5kovt7ixdn4qlymut3jnnpbu3" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_role FK6hyq1s72y4xvjomfxwjg3jynj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_role
    ADD CONSTRAINT "FK6hyq1s72y4xvjomfxwjg3jynj" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: user_roles FK7ov27fyo7ebsvada1ej7qkphl; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FK7ov27fyo7ebsvada1ej7qkphl" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_roles FKej3jidxlte0r8flpavhiso3g6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT "FKej3jidxlte0r8flpavhiso3g6" FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: credentials FKl0uehcbvq6sv91wv1e1evjg5y; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credentials
    ADD CONSTRAINT "FKl0uehcbvq6sv91wv1e1evjg5y" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_role FKo3h0gube7q94qbp2j46n7uxmk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_role
    ADD CONSTRAINT "FKo3h0gube7q94qbp2j46n7uxmk" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: documents fk_documents_owner; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT fk_documents_owner FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

