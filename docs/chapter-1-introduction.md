# CHAPTER ONE: INTRODUCTION

## 1.1 Introduction

Human Resource Management (HRM) — the strategic and coherent approach to managing an organisation's workforce across recruitment, onboarding, development, and administration — remains fundamental to organisational performance, since hiring errors and administrative inefficiency propagate downstream costs in training, turnover, and lost productivity that are far more expensive to correct than to prevent. Yet many organisations, particularly small and medium-sized enterprises (SMEs) in developing economies such as Ghana, continue to rely on manual, paper-driven recruitment processes — newspaper advertisements, employee referrals, and unsolicited applications screened by hand — that are slow, subjective, and difficult to audit. At the same time, Artificial Intelligence (AI) has begun to reshape recruitment practice globally through automated résumé screening, candidate ranking, and predictive analytics, offering a route to faster and more consistent hiring decisions where infrastructure and adoption conditions permit it.

This project proposes and implements **CoreRecruiter**, a centralised, AI-integrated web platform for hiring, employee management, and HR reporting, designed specifically for the Ghanaian organisational context. CoreRecruiter combines an applicant-facing job listing and application portal, an AI-assisted screening and ranking module, an HR administration dashboard, and an employee self-service (ESS) portal into a single system, so that a candidate's data and evaluation history carry forward from application through to active employment rather than being re-entered across disconnected tools.

A number of key terms and constructs recur throughout this study and are defined here for clarity:

- **Applicant Tracking System (ATS):** software that manages the recruitment pipeline — job postings, applications, résumés/CVs, and candidate evaluation — from a single interface.
- **Human Resource Information System (HRIS) / Electronic HRM (e-HRM):** the use of web-based, networked technologies to support HR policy implementation, ranging from simple digitisation of paper processes to systems that actively reshape how HR decisions are made.
- **Large Language Model (LLM) Agent:** a language model given the ability to call external tools or functions — for example, retrieving a job's structured requirements or a candidate's profile data — and to reason over the results before producing a decision, rather than pattern-matching on raw text alone.
- **Decomposed / Explainable AI Score:** a screening score broken down into its constituent criteria (e.g., skills, experience, education) rather than returned as a single opaque number, so that a human reviewer can audit the reasoning behind it.
- **Person–Job (P–J) Fit and Person–Organisation (P–O) Fit:** P–J fit is the match between a candidate's skills and a specific role's requirements; P–O fit is the broader congruence between a candidate's values and an organisation's culture. Automated screening is generally better suited to assessing P–J fit, leaving P–O fit to human-mediated interview stages.
- **Employee Self-Service (ESS):** a module that allows employees to independently manage their own attendance, leave, payroll, and document records without routing every request through an HR administrator.
- **Technology Acceptance Model (TAM):** a model explaining system adoption as a function of perceived usefulness and perceived ease of use — both directly relevant to whether HR staff with limited prior exposure to HR software will actually use a new system.

## 1.2 Background of the Study

Recruitment and selection are widely documented as consequential functions within HRM, yet studies of Ghanaian and wider West African organisations repeatedly find heavy reliance on informal channels — newspaper advertisements, campus recruitment, employee referrals, and unsolicited applications — with only limited and uneven adoption of internet-based or data-driven recruitment methods. Reviews of recruitment practice in the sub-region describe selection processes as often "clouded in subjectivity" and not grounded in objective, criterion-referenced assessment, a pattern attributed to weak HR policy infrastructure, skills shortages among HR practitioners, and slow uptake of HR technology rather than any rejection of digital tools in principle.

Globally, e-HRM in the form of ATS platforms has been shown to improve efficiency, transparency, and decision quality by centralising candidate data and enabling analytics-supported shortlisting — and more recently, AI techniques such as natural language processing (NLP) and LLM-agent-based screening have demonstrated significant gains in screening speed and consistency over manual review. However, the dominant commercial ATS and HRIS platforms (e.g., Workday, Greenhouse, BambooHR, Zoho Recruit) are built around enterprise or Western SME assumptions: dollar-denominated pricing, multi-month implementation timelines, and AI features tuned for high-volume, English-language, Western-labour-market résumés. They are also, almost without exception, point solutions — an ATS manages hiring, while a separate HRIS or payroll system manages the employee once hired — requiring organisations to integrate, or manually reconcile, two disconnected systems. Regional efforts such as SeamlessHR show that an integrated, Africa-focused model is commercially viable, but as proprietary products their screening methodology is not published for independent scrutiny, leaving no documented, auditable rubric against which a Ghanaian organisation could verify that an AI screening tool's judgements are consistent and free of bias.

At the same time, adoption research specific to Sub-Saharan Africa — covering HRIS uptake among SMEs and e-HRM implementation in the public sector — consistently identifies cost of acquisition, unstable ICT infrastructure, and limited digital literacy among HR staff as the binding constraints on adoption, rather than any rejection of digitalisation itself. Compounding this, once a candidate is hired, many Ghanaian SMEs continue to manage attendance, leave, payroll, and complaints manually or through generic spreadsheets, extending the same inefficiency past the point of hire.

This study is motivated by the resulting gap: existing systems that are technically capable of AI-assisted, integrated recruitment and HR management are either not designed for Ghanaian cost and infrastructure constraints, or do not expose their AI screening logic in a way that HR staff and candidates can trust and audit. CoreRecruiter is proposed as a response to that specific gap, not as a generic claim that "AI improves hiring."

## 1.3 Research Problem Statement

Ghanaian organisations — particularly SMEs — lack access to a recruitment and HR platform that is simultaneously (a) integrated across the full hiring-to-employment lifecycle, (b) transparent in how any AI-assisted screening arrives at its recommendations, and (c) realistic in cost and technical complexity for organisations without a dedicated IT department. This produces the following recurring problems:

1. Job postings, applications, and candidate evaluation are managed through informal or manual channels, making hiring slow, subjective, and difficult to audit.
2. Where AI screening tools exist, they are largely developed for enterprise, non-Ghanaian markets, and typically return an aggregate match score without decomposing it into criteria an HR user could independently inspect — undermining trust and inviting the "illusion of neutrality" documented in recent audits of commercial AI hiring tools.
3. Applicant and candidate data captured during recruitment is not carried forward into the employee record once a candidate is hired, forcing duplicate data entry during onboarding and severing the link between screening history and employee performance data.
4. HR administrators lack a single dashboard to manage departments, employees, interviews, leave, payroll, and complaints, leading to fragmented oversight.
5. Employees have limited or no self-service access to their own attendance, leave, payroll, and document records, increasing the administrative burden on HR staff for routine requests.
6. Commercial platforms capable of addressing (1)–(4) assume enterprise budgets, stable high-bandwidth connectivity, and dedicated IT support — conditions not typically available to Ghanaian SMEs — while systems priced for this market tend to offer little or no AI-assisted screening.

The central problem this project addresses is: **how can an integrated, AI-assisted recruitment and human resource management platform be designed and built for the Ghanaian SME context, such that its AI screening is transparent and auditable, its cost and technical footprint are realistic for resource-constrained organisations, and applicant data carries forward seamlessly into post-hire employee administration?**

## 1.4 Research Questions

This study is guided by the following questions:

1. What workflow gaps exist between manual recruitment practice and post-hire employee administration in Ghanaian SMEs, and what do they cost in time, consistency, and auditability?
2. What features are necessary for an integrated recruitment and HR platform to serve three distinct user groups — applicants, HR administrators, and employees — within the cost and infrastructure constraints typical of the Ghanaian SME context?
3. How can AI-assisted candidate screening be designed so that its scoring is decomposed and explainable to an HR reviewer, rather than returned as an opaque aggregate score?
4. How can a single data model carry an applicant's information and screening history forward through onboarding into an active employee record without duplication?
5. What role-based access, authentication, and data-handling mechanisms are required to secure applicant and employee data in line with Ghana's Data Protection Act, 2012 (Act 843)?
6. To what extent can an integrated self-service (ESS) module reduce the manual administrative workload placed on HR personnel after hiring?

## 1.5 Research Aims & Objectives

**Aim:** To design and develop CoreRecruiter, an integrated, AI-assisted, web-based recruitment and human resource management platform that unifies the applicant journey, transparent AI-assisted screening, HR administration, and employee self-service into a single system suited to the Ghanaian SME context.

**Specific Objectives:**

1. To review existing recruitment and HRIS tools, AI-driven screening approaches, and the relevant theoretical literature (e-HRM, Technology Acceptance Model, Person–Job/Person–Organisation Fit) to identify the gaps between standalone applicant-tracking systems and standalone HR systems, and between existing AI screening tools and the transparency such screening requires to be trustworthy.
2. To design a system architecture and data model that allows an applicant record, including its AI screening history, to transition into an employee record without re-entry of data.
3. To implement a job listing and application module through which applicants can browse vacancies, submit applications, and track application status.
4. To implement an AI-assisted screening and candidate-ranking module using a tool-calling LLM agent that retrieves structured job requirements and candidate profile data and returns a decomposed, explainable score (covering skills, experience, education, and role-specific criteria) rather than a single opaque figure.
5. To implement an HR administration dashboard covering departments, employees, job postings, interview scheduling, applicant evaluation, leave, payroll, announcements, and reporting.
6. To implement an employee self-service (ESS) module covering attendance, leave requests, payroll/payslip viewing, document uploads, and complaint reporting.
7. To implement authentication, role-based access control, and data-handling practices consistent with Ghana's Data Protection Act, 2012 (Act 843), separating applicant, employee, and HR administrator permissions.
8. To evaluate the resulting system against the stated objectives through functional testing and, where feasible, usability assessment with prospective HR users.

## 1.6 Scope and Limitations of the Study

**Scope:** The study covers the design and implementation of a web application with three user-facing surfaces — an applicant/job-seeker portal, an HR administrator dashboard, and an employee self-service portal — together with an AI-assisted screening and ranking module and the supporting authentication, onboarding, and notification functionality that connects them. The system is built as a Next.js (TypeScript) frontend backed by a modular Node.js/TypeScript backend covering authentication, job and applicant management, AI screening, employee management, onboarding, ESS, HR administration, and notifications, and is evaluated primarily against the needs of Ghanaian SME organisations.

**Limitations:**

1. The project is developed and evaluated within an academic timeframe and budget, so it targets core recruitment-to-HR workflows and a defined AI screening rubric rather than every feature found in enterprise HRMS products (e.g., multi-jurisdiction payroll tax compliance, deep third-party payroll integrations).
2. Testing is conducted primarily with simulated applicant and employee data rather than a live, multi-organisation production deployment, so adoption and infrastructure-resilience claims are treated as hypotheses for future evaluation rather than proven outcomes.
3. AI screening in this study is scoped to Person–Job fit (skills, experience, education, and stated nice-to-have criteria); Person–Organisation fit is deliberately left to human interviewers, consistent with the literature's caution against relying on automated assessment for judgements it is poorly positioned to make.
4. The system assumes a single organisation's HR structure at a time (departments, roles, and policies configured per company) rather than multi-tenant SaaS-scale isolation.
5. Decomposing and exposing the AI score's reasoning mitigates, but does not eliminate, the risk of algorithmic bias; ongoing bias monitoring beyond the scope of this project would be required for production-scale deployment.
6. Mobile-native applications are out of scope; the system is delivered as a responsive web application.

## 1.7 Research Methodology (Brief)

This project follows an **iterative, Agile-inspired software development methodology**, comprising:

1. **Requirements gathering and literature review:** identifying the core workflows needed by three user roles — applicants, HR administrators, and employees — and grounding the AI screening design in the e-HRM, TAM, and algorithmic-fairness literature reviewed in Chapter Two.
2. **System design:** producing the data model, module breakdown (authentication, job/applicant management, AI screening and ranking, onboarding, employee management, ESS, HR-admin, notifications), and the decomposed AI scoring rubric that connects recruitment to post-hire administration.
3. **Implementation:** building the system incrementally using a Next.js/TypeScript frontend (App Router, Tailwind CSS, shadcn/ui) and a modular Node.js/TypeScript backend, with a tool-calling LLM agent implementing the AI screening module, and each module developed and integrated iteratively.
4. **Testing:** functional testing of each module as it is completed, followed by integration testing across the applicant-to-employee workflow and consistency testing of the AI screening component.
5. **Evaluation:** assessing the completed system against the research objectives stated in Section 1.5.

Full methodological detail, including tools, design diagrams, the AI scoring rubric, and testing procedures, is presented in Chapter Three.

## 1.8 Organization of the Project

This project report is organized into five chapters:

- **Chapter One: Introduction** presents the background, problem statement, research questions, aims and objectives, scope and limitations, and a brief overview of the methodology used in this study.
- **Chapter Two: Theory, Background and Review** examines the theoretical foundations (HRM theory, the Technology Acceptance Model, Person–Job/Person–Organisation Fit theory, and the technical concepts underpinning AI-assisted screening), critically reviews empirical studies and commercial systems relevant to e-recruitment, HRIS, and AI-driven hiring — with particular attention to Ghana and comparable Sub-Saharan African economies — and synthesises this material into the specific gaps CoreRecruiter is designed to close.
- **Chapter Three: Methodology and System Design** details the software development methodology, system requirements, architecture, data model, AI screening rubric, and design artifacts (use case diagrams, entity-relationship diagrams, and interface designs) used to build the system.
- **Chapter Four: Implementation and Results** describes how the system was implemented, the tools and technologies used, and presents the results of functional testing across the applicant, HR administrator, and employee-facing modules, including evaluation of the AI screening component.
- **Chapter Five: Summary, Conclusion, and Recommendations** summarizes the findings of the project, evaluates the extent to which the stated objectives were achieved, discusses limitations encountered during development, and offers recommendations for future work.
