# CHAPTER FIVE: CONCLUSION AND FUTURE WORK

## 5.1 Introduction

This chapter concludes the development and evaluation of CoreRecruiter. It summarises the results presented in Chapter Four, relates those results to the aim and objectives of the study, makes recommendations for use and improvement, and identifies areas for future work. The conclusions are based on functional tests conducted with synthetic data in a local development environment. They therefore describe what was demonstrated by the implemented system under the selected test conditions and do not claim that all production, legal, scalability, usability, or fairness requirements have been fully established.

## 5.2 Summary of Results

The project designed and implemented CoreRecruiter as an integrated web-based recruitment and human resource management platform. The system combines an applicant portal, an HR administration dashboard, an employee self-service portal, and an AI-assisted candidate screening feature. The implementation used a Next.js and React frontend, TypeScript services, REST communication, PostgreSQL, Prisma, file upload services, email-related operations, and role-based authentication and authorization.

The principal results were as follows:

1. **Integrated recruitment workflow:** Applicants can browse open jobs, provide profile information, submit applications, upload supporting documents, and receive application-related status information. HR users can create and manage job listings, review applications, update application statuses, and schedule interviews.
2. **HR administration:** The system provides connected workflows for employee records, departments, office locations, leave requests, payroll, announcements, interviews, and documents. These records are linked through the database rather than being maintained as isolated forms.
3. **Employee self-service:** Employees can access permitted information and submit requests such as leave applications. HR users can review and decide on those requests, making the resulting status visible in the workflow.
4. **Validation and data integrity:** Required fields, dates, permitted values, duplicate applications, compensation data, and uploaded file types are checked before processing. Relational links, unique constraints, and controlled statuses help prevent inconsistent records.
5. **Security and access control:** Authentication, role checks, and company-scoped access restrict protected operations. The tests showed that unauthenticated users and users without the required role were refused access to protected actions.
6. **AI-assisted screening:** The screening feature produces a score and an explanatory result when adequate candidate and job information is supplied. This supports HR review by providing more context than an unexplained aggregate score. The feature remains decision support and does not replace human judgement.

The functional evaluation included 27 scenarios covering authentication, authorization, recruitment, applications, employee management, leave, payroll, interviews, announcements, document uploads, and AI screening. All scenarios were recorded as passing in the test results. The negative tests were especially significant: incorrect credentials, invalid verification details, missing fields, duplicate applications, invalid leave dates, unsupported files, incomplete payroll data, and role-inappropriate operations were rejected as expected.

## 5.3 Conclusion Against the Objectives

The overall aim was to design and develop an integrated, AI-assisted recruitment and HR management platform suited to the Ghanaian SME context. The implementation and functional results indicate that this aim was substantially achieved at prototype and functional-system level.

The stated objectives can be concluded as follows:

| Objective | Conclusion | Basis of conclusion |
|---|---|---|
| Review existing recruitment and HRIS tools and relevant theory | Achieved at the study level | The project identified the gap between recruitment and post-hire administration and used e-HRM, Technology Acceptance Model, and Person–Job/Person–Organisation Fit concepts to frame the system. |
| Design an architecture and data model connecting applicant and employee information | Substantially achieved | The frontend, REST services, Prisma access layer, and PostgreSQL relationships provide connected records across recruitment and HR modules. A larger production integration test would be needed to verify every transition. |
| Implement job listings, applications, and status tracking | Achieved | Job creation, public browsing, valid application submission, duplicate prevention, document handling, and application status tests passed. |
| Implement explainable AI-assisted screening | Functionally achieved with limitations | The system returned a score and explanatory summary for sufficiently complete data. Statistical accuracy, repeatability across large datasets, and fairness were not established by the functional test. |
| Implement the HR administration dashboard | Achieved for the evaluated workflows | Employee, leave, payroll, interview, announcement, job, and applicant workflows were represented and tested. |
| Implement employee self-service | Achieved for the evaluated workflows | Employee access and leave request workflows were included, with HR approval or rejection producing a visible state change. |
| Implement authentication, role-based access, and data handling controls | Functionally achieved | Authentication and role-inappropriate access tests passed, while company identifiers and relational boundaries were used in protected operations. An independent security audit remains necessary. |
| Evaluate the system against the objectives | Achieved at functional-test level | Twenty-seven synthetic-data scenarios passed in the local test environment. Usability, load, production resilience, and AI fairness require additional evaluation. |

The conclusion is therefore positive but bounded. CoreRecruiter demonstrates that an integrated recruitment-to-HR workflow can be implemented with role-specific interfaces, connected records, validation, controlled status transitions, and AI-assisted screening. The results do not prove that the platform is ready for unrestricted production deployment or that the AI output is free from bias.

## 5.4 Justification of the Conclusions

The conclusions are justified by the relationship between the test procedures, observed results, and stated limitations. Each test began with a precondition and defined action, then checked the resulting screen, response, or stored record. This provided direct evidence that the main user roles could complete the selected operations and that invalid operations did not produce the intended protected or incomplete records.

The conclusion about functional completeness is supported by the breadth of the 27 scenarios. The tests covered the major modules rather than only the public job page or authentication flow. For example, a job could be created and made visible to applicants, an application could be linked to a candidate and a job, leave could move from pending to an HR decision, and payroll could follow controlled status changes. These observations support the conclusion that the modules are connected through a working application and data layer.

The conclusion about security is narrower. The rejection of unauthenticated and role-inappropriate actions demonstrates that access checks operate during request processing in the tested cases. It does not constitute a penetration test, a formal privacy compliance assessment, or proof that every endpoint and deployment configuration is secure. The conclusion about data integrity is similarly supported by validation, relationships, duplicate checks, and status tests, but should be confirmed under larger and more varied datasets.

The conclusion about AI screening is based on successful functional output: the system produced a score and explanation when the required candidate and job information was present and refused or reported insufficient information when it was not. This supports the claim that the feature is implemented and usable as decision support. It does not support claims about hiring accuracy, reduced bias, agreement with HR experts, or improved recruitment outcomes because those measures were outside the scope of the evaluation.

## 5.5 Recommendations

The following recommendations arise from the implementation results and the limitations of the evaluation:

1. **Use human review for recruitment decisions.** HR users should treat AI screening scores and explanations as prioritisation aids. Final decisions should be based on documented criteria, human review, interviews, and applicable organisational policies.
2. **Maintain complete and consistent source data.** HR teams and applicants should provide accurate job requirements, skills, education, experience, and supporting documents. Screening quality depends on the completeness and wording of this information.
3. **Apply least-privilege access.** Each organisation should review role permissions, company boundaries, administrative accounts, and audit logs before deployment. Access to payroll, employee documents, and applicant information should be limited to users who require it for their duties.
4. **Establish data protection procedures.** Before operational use, the organisation should define retention periods, consent and privacy notices, correction procedures, deletion or archival rules, backup controls, and incident-response responsibilities in line with applicable data-protection requirements.
5. **Pilot the system with a small HR team.** A controlled pilot with representative HR users can identify workflow, terminology, connectivity, and training issues that synthetic functional tests cannot reveal.
6. **Monitor the system after deployment.** Administrators should monitor failed requests, response times, database health, upload failures, audit activity, backup success, and screening outcomes. Monitoring should be paired with a clear process for correcting inaccurate records.
7. **Document organisational policies in the configuration.** Leave rules, payroll periods, approval authority, application statuses, interview procedures, and announcement groups should be configured and documented consistently for each organisation.

## 5.6 Future Work

Future work should extend both the system and the evidence used to evaluate it:

1. **Usability evaluation:** Conduct moderated usability tests and interviews with HR administrators, HR managers, employees, and applicants. Measures such as task completion time, error rate, perceived usefulness, perceived ease of use, and user satisfaction would provide evidence beyond developer-led functional testing.
2. **Production and scale testing:** Deploy the system in a controlled staging environment and measure concurrent users, API response times, database performance, queue or scheduled-task behaviour, large-file handling, and recovery after service interruption.
3. **Security and compliance assessment:** Perform threat modelling, dependency review, authorization testing, penetration testing, secure configuration review, and an assessment against applicable Ghanaian data-protection obligations.
4. **AI validation and fairness monitoring:** Build a sufficiently large, representative, and appropriately governed labelled dataset. Compare screening results with qualified HR reviewers, measure agreement and error patterns, test repeatability, and monitor outcomes across relevant groups without using protected characteristics improperly.
5. **Improved explainability:** Preserve the criteria, source fields, score components, model or provider version, and timestamp used for each screening result. This would make later review and audit more reliable.
6. **Applicant-to-employee automation:** Extend the tested workflow so that an accepted candidate can be converted into an employee record with verified information and explicit user confirmation, while preventing unnecessary duplication and preserving the application history.
7. **Infrastructure resilience:** Add stronger offline or low-bandwidth handling where practical, background retries for non-critical notifications, automated backups, disaster recovery exercises, and documented deployment procedures suitable for organisations with limited technical support.
8. **Additional integrations:** Evaluate integrations with payroll providers, calendar services, identity providers, email delivery services, and local reporting requirements only after privacy, security, and data ownership responsibilities have been defined.

## 5.7 Final Conclusion

CoreRecruiter addresses the central problem identified in this study by bringing recruitment, applicant management, HR administration, employee self-service, and AI-assisted screening into one web-based platform. The implementation shows that the proposed workflow can be supported by a modular frontend, REST services, a relational data model, validation, role-based access control, and connected records.

The evaluation provides evidence that the principal workflows operated correctly for the selected synthetic scenarios and that important invalid or unauthorized actions were rejected. It also shows the value of an explanatory screening result: HR users receive a basis for review rather than only an opaque number. Nevertheless, the system should be understood as a functionally evaluated platform rather than a fully validated production service. Larger datasets, real users, security assessment, load testing, privacy review, and AI fairness monitoring are required before strong claims about operational impact or responsible large-scale deployment can be made.

The project therefore makes a practical contribution by demonstrating an integrated and extensible foundation for recruitment and HR administration in the Ghanaian SME context. Its strongest conclusion is not that technology removes the complexity of HR decision-making, but that a carefully structured system can make those workflows more connected, traceable, and reviewable while leaving consequential decisions under accountable human oversight.