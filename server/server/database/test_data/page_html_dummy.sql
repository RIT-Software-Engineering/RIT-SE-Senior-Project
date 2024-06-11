INSERT INTO page_html (name, html) VALUES
('homePagePanel', '<div class="row">
                                   <h2>Overview</h2>
                               </div>
                               <div class="row">
                                   <p class="overviewText">
                                       Senior Project is a capstone course completed by every Software Engineering senior. Small teams of
                                       students are assigned to solve challenging, real-world software issues for companies and
                                       organizations. External corporate and non-profit sponsors submit proposals for projects that teams
                                       of 4 or 5 students will work on.
                                   </p>
                                   <p class="overviewText">
                                       Over the course of two terms, each team works with a project sponsor, applying the software
                                       engineering skills that the students learned in class and on co-op. They carry the project from
                                       inception through an entire software development lifecycle. The end result is a functional software
                                       tool ready for use by the sponsor''s organization.
                                   </p>
                               </div>'),
('sponsor', '<div class="row">
                             <h2 class="ui header">Become a Project Sponsor</h2>
                         </div>
                         <div class="row">
                             <p>
                                 Please reference the&nbsp
                                 <a href="../doc/ProposalInstructions.pdf" target="_blank">
                                     proposal instructions
                                 </a>&nbsp
                                 as you prepare your project proposal.
                             </p>
                         </div>
                         <div class="row">
                             <button id="proposalBtn" class="ui button" onClick="clickHandler()">
                                 Submit a Project Proposal
                             </button>
                             <script>
                              function clickHandler() {
                                     window.location.href = window.location.origin + \'/proposal-form\';
                              }
                            </script>
                         </div>

                         <div class="ui divider"></div>

                         <div class="row">
                             <h2 class="ui header">Sponsor F.A.Q.</h2>
                         </div>
                         <div class="row">
                             <p>
                                 Is your organization interested in sponsoring a Senior Project? Browse the FAQs below for more
                                 information.
                             </p>
                             <br />
                             <div class="ui styled fluid accordion">
               <div class="title">
             <script>
             $(\'.ui.accordion\').accordion();
             </script>
                 <i class="dropdown icon"></i>
                 How will my organization benefit from sponsoring a Senior Project?
               </div>
               <div class="content">
                 <p class="transition hidden"><ul>
                                     <li>Help educate the next generation of software engineers who you might want as employees</li>
                                     <li>
                                         Get the benefits of any work the team does in clarifying your problem, designing a solution,
                                         and building a working system
                                     </li>
                                     <li>
                                         Have fun working with a team of software engineering students who are excited about the
                                         challenge of your project
                                     </li>
                                 </ul></p>
               </div>
               <div class="title">
                 <i class="dropdown icon"></i>
                 What is the size, scope and duration of these projects?
               </div>
               <div class="content">
                 <ul>
                                     <li>
                                         Teams generally consist of four or five seniors. Students work on the project for two terms
                                         (about 30 weeks). During this time, each team member is expected to devote an average of ten
                                         hours/week on the project.
                                     </li>
                                     <li>
                                         Project scope should be determined with this level of effort in mind. Also remember that it
                                         is unlikely that students will have detailed knowledge of the sponsor''s domain. Time for
                                         acquiring this knowledge must be factored into the project’s scope.
                                     </li>
                                     <li>
                                         If your project has a scope beyond software, we can work with the other colleges at RIT to
                                         create a multi-disciplinary team that covers all the aspects of your project.
                                     </li>
                                     <li>
                                         We are interested in projects from any application domain, and of any type including
                                         web-based systems, desktop applications, or embedded projects. A project should require the
                                         team to demonstrate their software engineering skills including requirements elicitation,
                                         design and implementation, and deployment. Our past experience has shown that web-based
                                         projects which are only client-side website development or a web interface to a database
                                         without significant backend business logic are too small in scope to require the students to
                                         demonstrate this full range of skills. Mobile aps by themselves are usually too small in
                                         scope. However, a mobile which is the front-end to a larger system that the team must also
                                         create does typically have sufficient scope. If you have any questions, contact the Senior
                                         Project Coordinator at{" "}
                                         <a href="mailto:seniorprojects@se.rit.edu">seniorprojects@se.rit.edu</a>.
                                     </li>
                                 </ul>
               </div>
               <div class="title">
                 <i class="dropdown icon"></i>
                 Who works on the project?
               </div>
               <div class="content">
                 <ul>
                                     <li>The project sponsor works with a senior team and their faculty coach.</li>
                                     <li>
                                         The students are responsible for the completion of the project. The faculty coach acts
                                         primarily as guide and mentor.
                                     </li>
                                     <li>
                                         The faculty coach will not actively manage the project, nor will he or she assume any
                                         technical role other than general consultant.
                                     </li>
                                 </ul>
               </div>
             <div class="title">
                 <i class="dropdown icon"></i>
                 What process is followed over the course of the project?
               </div>
               <div class="content">
                 <ul>
                                     <li>
                                         The ideal project is one where the student team demonstrates their skills in requirements
                                         elicitation and analysis, architecture and design, implementation, testing, and delivery
                                         over the course of two terms.
                                     </li>
                                     <li>
                                         The specific process each team uses is part of the negotiation between the sponsor and team,
                                         under the guidance of the team’s faculty coach.
                                     </li>
                                     <li>
                                         If your project will require adherence to specific internal, industry, or regulatory
                                         standards, or that the team follows a particular process methodology, please include this
                                         information in your proposal description.
                                     </li>
                                 </ul>
               </div>
             <div class="title">
                 <i class="dropdown icon"></i>
                 What are my responsibilities and commitments as a sponsor?
               </div>
               <div class="content">
                 <ul>
                                     <li>
                                         During the project, you are expected to commit the resources needed to ensure the project’s
                                         success, including personnel, documents, specifications, etc.
                                     </li>
                                     <li>Specific responsibilities include:</li>
                                     <ul>
                                         <li>Prepare an initial project description summary.</li>
                                         <li>
                                             Provide any hardware and software not currently available at the RIT facilities,
                                             including software licenses or remote access so that the team can perform all project
                                             work from the RIT facilities. Hardware and software can be a permanent donation to the
                                             Department of Software Engineering or loaned only for the project duration.
                                         </li>
                                         <li>
                                             Ensure the accessibility of personnel throughout the project to help the team understand
                                             both the domain and the problem being addressed - such accessibility is particularly
                                             critical during the initial phases and will require that the sponsor''s personnel
                                             participate in meetings at RIT, or remotely with the student team.
                                         </li>
                                         <li>Participate in team, product, and process presentations and reviews.</li>
                                         <li>Provide information the faculty can use to assess the success of the project.</li>
                                         <li>
                                             Assess the completed project, document your assessment, and submit it to the Department
                                             of Software Engineering.
                                         </li>
                                     </ul>
                                 </ul>
               </div>
             <div class="title">
                 <i class="dropdown icon"></i>
                 How are proposals reviewed?
               </div>
               <div class="content">
                 <ol>
                                     <li>
                                         Any comments and editing suggested by the Senior Project Coordinator is the first review.
                                         The Coordinator rarely removes a proposal at this point, and passes all proposals to the
                                         next review stage. You should, however, address the Coordinator''s comments because they
                                         typically track the comments made in the second review stage.
                                     </li>
                                     <li>
                                         We have always been in the fortunate position to receive more project proposals than the
                                         number of teams we will have. The software engineering faculty do the second review and vet
                                         proposals down to 2 or 3 more than the number of teams we will have. The top reasons for
                                         discarding a proposal are:
                                         <ul>
                                             <li>The scope is too small</li>
                                             <li>
                                                 The scope has a limited range particularly when limited to mostly data analysis or
                                                 algorithm development instead of the full-scale engineering of a significant
                                                 software system
                                             </li>
                                             <li>
                                                 A project description that left a majority of the reviewers wondering what the team
                                                 was really going to do.
                                             </li>
                                         </ul>
                                     </li>
                                     <li>Finally, the students get to rank their preferred projects.</li>
                                 </ol>
               </div>
             </div>
                         </div>');
