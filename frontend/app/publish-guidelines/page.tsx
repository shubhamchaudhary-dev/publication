'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function PublishGuidelines() {
  const sections = [
    { id: 'full-length', title: 'Full-length research article' },
    { id: 'review-articles', title: 'Review articles' },
    { id: 'short-communications', title: 'Short communications' },
    { id: 'peer-review', title: 'Peer review' },
    { id: 'special-issues', title: 'Special issues and article collections' },
    { id: 'submission-declaration', title: 'Submission declaration' },
    { id: 'authorship', title: 'Authorship' },
    { id: 'competing-interests', title: 'Declaration of competing interests' },
    { id: 'generative-ai', title: 'Declaration of generative AI use' },
    { id: 'manuscript-formation', title: 'Manuscript formation' },
    { id: 'ai-artwork', title: 'Generative AI and Figures, images and artwork' },
    { id: 'supplementary-material', title: 'Supplementary material' },
    { id: 'references', title: 'References' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-[#333] dark:text-[#E2E8F0] font-sans">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
        <Link href="/" className="inline-flex items-center text-[14px] font-medium text-[#0055A4] dark:text-[#3b82f6] hover:underline mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>

        <h1 className="text-[28px] font-bold text-[#333] dark:text-white mb-8">Guidelines for Authors</h1>
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Sidebar */}
          <aside className="w-full md:w-[260px] lg:w-[280px] shrink-0 md:sticky md:top-[90px] bg-[#F9F9F9] dark:bg-[#1E293B] shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="px-5 py-4 flex items-center mb-2 mt-2">
              <div className="w-[5px] h-[18px] bg-[#1E4D6B] mr-3"></div>
              <h3 className="font-serif italic text-[18px] font-bold text-[#1E4D6B] dark:text-white m-0">Sections</h3>
            </div>
            <nav className="px-5 pb-8">
              <ul className="space-y-[1px]">
                {sections.map((section) => (
                  <li key={section.id} className="border-b border-[#EBEBEB] dark:border-[#334155] py-3 last:border-0">
                    <a href={`#${section.id}`} className="text-[13.5px] text-[#0055A4] dark:text-[#60a5fa] hover:underline block leading-snug pr-2">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 pb-20">
            <div className="space-y-12 text-[15px] leading-[1.65] text-[#333] dark:text-[#CBD5E1] text-justify">
              
              <section id="full-length">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Full-length research article</h2>
                <p className="mb-4">
                  A Full-Length Research Article includes all main elements (i.e., title, abstract, keywords, captions, bibliography, and illustrations) but excludes supplementary data/appendices. Full-length Articles should use the basic structure below as a guide:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Introduction</li>
                  <li>Literature Review/Research Context/Background</li>
                  <li>Methods</li>
                  <li>Results</li>
                  <li>Discussion</li>
                  <li>Conclusion</li>
                </ul>
                <p className="mb-4">This should be followed by:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Acknowledgements (optional)</li>
                  <li>Funding statement (optional)</li>
                  <li>Declaration of AI assisted writing (optional)</li>
                  <li>Figures (optional)</li>
                  <li>References</li>
                </ul>
              </section>

              <section id="review-articles">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Review articles</h2>
                <p className="mb-4">
                  A Review Article is a comprehensive summary of the current understanding of a specific research topic and is based on previously published research. This includes all main elements (i.e., title, abstract, keywords, captions, bibliography and illustrations) but excludes supplementary data/appendices. Unlike Full-length Articles, it does not contain new research, data and results, but can propose new inferences based on the combined findings of previous research.
                </p>
                <p className="mb-4">
                  Review articles Articles are typically two types: <strong>Literature Review:</strong> A general survey of current and past literature on a specific research topic. <strong>Systematic Review:</strong> This is more focused and aims to investigate a highly focused research question. As such, it is more detailed, with information on the search strategy used, the eligibility criteria for inclusion of studies, the methods utilized to review the collected information.
                </p>
                <p className="mb-4">
                  Regardless of the type, Review Articles should have a clearly defined research question, use a wide range of credible sources, have a clear introduction outlining the aims and methods used to address the question. Review Articles should be critical and unbiased and end with a critical discussion and clear summary. The structure should be based on that of a Full-length Article.
                </p>
              </section>

              <section id="short-communications">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Short communications</h2>
                <p className="mb-4">
                  Short Communications are for the presentation of brief observations which do not warrant a Full-length Article. Content should be original and significant. Submissions of this type has no word limit. As a short paper for rapid dissemination, the main text of a Short Communication should not be subdivided. The manuscript should include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Title</li>
                  <li>Abstract (maximum 100 words)</li>
                  <li>Keywords</li>
                  <li>Main text (no sub-divisions)</li>
                  <li>References</li>
                </ul>
                <p className="mb-4">
                  Appendices are not accepted for Short Communications and a maximum of 3 figures and tables is accepted.
                </p>
              </section>

              <section id="peer-review">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Peer review</h2>
                <p className="mb-4">
                  This journal follows a double anonymized review process. Your submission will initially be assessed by our editors to determine suitability for publication in this journal. If your submission is deemed suitable, it will typically be sent to a minimum of two reviewers for an independent expert assessment of the scientific quality. The decision as to whether your article is accepted or rejected will be taken by our editors.
                </p>
                <p className="mb-4">Our editors are not involved in making decisions about papers which:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>they have written themselves.</li>
                  <li>have been written by family members or colleagues.</li>
                  <li>relate to products or services in which they have an interest.</li>
                </ul>
                <p className="mb-4">
                  Any such submissions will be subject to the journal's usual procedures and peer review will be handled independently of the editor involved and their research group.
                </p>
              </section>

              <section id="special-issues">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Special issues and article collections</h2>
                <p className="mb-4">
                  The peer review process for special issues and article collections follows the same process as outlined above for regular submissions, except, a guest editor may send the submissions out to the reviewers and may recommend a decision to the journal editor. The journal editor oversees the peer review process of all special issues and article collections to ensure the high standards of publishing ethics and responsiveness are respected and is responsible for the final decision regarding acceptance or rejection of articles.
                </p>
              </section>

              <section id="submission-declaration">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Submission declaration</h2>
                <p className="mb-4">When authors submit an article to a journal it is implied that:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>The work described has not been published previously except in the form of a preprint, an abstract, a published lecture, academic thesis or registered report.</li>
                  <li>The article is not under consideration for publication elsewhere.</li>
                  <li>The article's publication is approved by all authors and tacitly or explicitly by the responsible authorities where the work was carried out.</li>
                  <li>if accepted, the article will not be published elsewhere in the same form, in English or in any other language, including electronically, without the written consent of the copyright-holder.</li>
                </ul>
                <p className="mb-4">
                  To verify compliance with our journal publishing policies, we may check your manuscript with our screening tools.
                </p>
              </section>

              <section id="authorship">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Authorship</h2>
                <p className="mb-4">All authors should have made substantial contributions to all of the following:</p>
                <ol className="list-decimal pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>The conception and design of the study, or acquisition of data, or analysis and interpretation of data</li>
                  <li>Drafting the article or revising it critically for important intellectual content.</li>
                  <li>Final approval of the version to be submitted.</li>
                </ol>
                <p className="mb-4">
                  All authors are accountable for all aspects of the work, to ensure that questions related to the accuracy or integrity of any part of the work are appropriately investigated and resolved.
                </p>
                <p className="mb-4">
                  Authors should appoint a single corresponding author to communicate with the journal during the editorial process. This individual submits the manuscript and all required documentation to the journal, and serves as the primary contact between the journal and the co-authors. Only the corresponding author’s affiliation will be used to determine eligibility for a publishing agreement, and possible discounts related to it. Affiliations of other co-authors are not relevant for eligibility.
                </p>
                
                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Changes to authorship</h3>
                <p className="mb-4">
                  The editors of this journal generally will not consider changes to authorship once a manuscript has been submitted. It is important that authors carefully consider the authorship list and order of authors and provide a definitive author list at submission.
                </p>
                <p className="mb-4">The policy of this journal around authorship changes:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>All authors must be listed in the manuscript and their details entered into the submission system. Changes can only be made prior to acceptance, and only if approved by the journal editor. This includes additions, deletion, or rearrangement of author names.</li>
                  <li>Requests to change authorship must be made by the corresponding author. The corresponding author must provide the reason for the request to the journal editor with written confirmation from all authors, including any authors being added or removed, that they agree with the changes. Requests which do not comply with the instructions outlined in the form will not be considered.</li>
                  <li>This journal does not allow authorship changes after acceptance. This includes additions, deletions, or the rearrangement of author names, including changes to the corresponding author.</li>
                  <li>The review process may be paused while a change in authorship request is being considered.</li>
                </ul>
              </section>

              <section id="competing-interests">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Declaration of competing interests</h2>
                <p className="mb-4">
                  All authors must disclose any financial and personal relationships with other people or organizations that could inappropriately influence or bias their work. Examples of potential competing interests include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Employment</li>
                  <li>Consultancies</li>
                  <li>Stock ownership</li>
                  <li>Honoraria</li>
                  <li>Paid expert testimony</li>
                  <li>Patent applications or registrations</li>
                  <li>Grants or any other funding</li>
                  <li>Affiliation with the journal as an Editor or Advisory Board Member</li>
                </ul>
              </section>

              <section id="generative-ai">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Declaration of generative AI use</h2>
                <p className="mb-4">
                  Authors must declare the use of generative AI in the manuscript preparation process upon submission of the paper.
                </p>
                <p className="mb-4">
                  We recognize the potential of generative AI and AI-assisted technologies (“AI Tools”), when used responsibly, to help researchers work efficiently, gain critical insights fast and achieve better outcomes. Increasingly, these tools, including AI agents and deep research tools, are helping researchers to synthesize complex literature, provide an overview of a field or research question, identify research gaps, generate ideas, and provide tailored support for tasks such as content organization and improving language and readability.
                </p>
                <p className="mb-4">
                  Authors preparing a manuscript for this journal can use AI Tools to support them. However, these tools must never be used as a substitute for human critical thinking, expertise and evaluation. AI technology should always be applied with human oversight and control.
                </p>
                <p className="mb-4">Ultimately, authors are responsible and accountable for the contents of their work. This includes accountability for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Carefully reviewing and verifying the accuracy, comprehensiveness, and impartiality of all AI-generated output (including checking the sources, as AI-generated references can be incorrect or fabricated).</li>
                  <li>Editing and adapting all material thoroughly to ensure the manuscript represents the author’s authentic and original contribution and reflects their own analysis, interpretation, insights and ideas.</li>
                  <li>Ensuring the use of any tools or sources, AI-based or otherwise, is made clear and transparent to readers. If AI Tools have been used, we require a disclosure statement upon submission; please see example below.</li>
                  <li>Ensuring the manuscript is developed in a way that safeguards data privacy, intellectual property and other rights, by checking the terms and conditions of any AI tool that is used.</li>
                </ul>
                <p className="mb-4">
                  Finally, authors must not list or cite AI Tools as an author or co-author on the manuscript since authorship implies responsibilities and tasks that can only be attributed to, and performed by, humans.
                </p>
                <p className="mb-4">
                  The use of AI Tools in the manuscript preparation process must be declared by adding a statement at the end of the manuscript when the paper is first submitted. The statement will appear in the published work and should be placed in a new section before the references list.
                </p>
                <p className="mb-4"><strong>An example:</strong></p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Title of new section: Declaration of generative AI and AI-assisted technologies in the manuscript preparation process.</li>
                </ul>
              </section>

              <section id="manuscript-formation">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Manuscript formation</h2>
                
                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3">Abstract</h3>
                <p className="mb-4">
                  You are required to provide a concise and factual abstract which does not exceed 250 words. The abstract should briefly state the purpose of your research, principal results and major conclusions. Some guidelines:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Abstracts must be able to stand alone as abstracts are often presented separately from the article.</li>
                  <li>Avoid references. If any are essential to include, ensure that you cite the author(s) and year(s).</li>
                  <li>Avoid non-standard or uncommon abbreviations. If any are essential to include, ensure they are defined within your abstract at first mention.</li>
                </ul>

                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Keywords</h3>
                <p className="mb-4">
                  You are required to provide 3 to 6 keywords for indexing purposes. Keywords should be written in English. Please try to avoid keywords consisting of multiple words (using "and" or "of").
                </p>
                <p className="mb-4">We recommend that you only use abbreviations in keywords if they are firmly established in the field.</p>

                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Highlights</h3>
                <p className="mb-4">You are encouraged to provide article highlights at submission.</p>
                <p className="mb-4">
                  Highlights are a short collection of bullet points that should capture the novel results of your research as well as any new methods used during your study. Highlights will help increase the discoverability of your article via search engines. Some guidelines:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Submit highlights as a separate editable file in the online submission system with the word "highlights" included in the file name.</li>
                  <li>Highlights should consist of 3 to 5 bullet points, each a maximum of 85 characters, including spaces.</li>
                </ul>
              </section>

              <section id="ai-artwork">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Generative AI and Figures, images and artwork</h2>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>We do not permit the use of Generative AI or AI-assisted tools to create or alter images in submitted manuscripts.</li>
                  <li>The only exception is if the use of AI or AI-assisted tools is part of the research design or methods (for example, in the field of biomedical imaging). If this is the case, such use must be described in a reproducible manner in the methods section, including the name of the model or tool, version and extension numbers, and manufacturer.</li>
                  <li>The use of generative AI or AI-assisted tools in the production of artwork such as for graphical abstracts is not permitted. The use of generative AI in the production of cover art may in some cases be allowed, if the author obtains prior permission from the journal editor and publisher, can demonstrate that all necessary rights have been cleared for the use of the relevant material, and ensures that there is correct content attribution.</li>
                </ul>
              </section>

              <section id="supplementary-material">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">Supplementary material</h2>
                <p className="mb-4">We encourage the use of supplementary materials such as applications, images and sound clips to enhance research. Some guidelines:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>Supplementary material should be accurate and relevant to the research.</li>
                  <li>Cite all supplementary files in the manuscript text.</li>
                  <li>Submit all supplementary materials at the same time as your manuscript.</li>
                  <li>Include a concise, descriptive caption for each supplementary file, describing its content.</li>
                  <li>After submission supplementary files can only be added or replaced in the revision stage of the editorial process.</li>
                  <li>Be aware that all supplementary materials provided will appear online in the exact same way as received. These files will not be checked, formatted or typeset by the production team.</li>
                </ul>
                
                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Author contributions: CRediT</h3>
                <p className="mb-4">Corresponding authors are required to acknowledge co-author contributions using roles:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <ul className="list-disc pl-6 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                    <li>Conceptualization</li>
                    <li>Data curation</li>
                    <li>Formal analysis</li>
                    <li>Funding acquisition</li>
                    <li>Investigation</li>
                    <li>Methodology</li>
                    <li>Project administration</li>
                  </ul>
                  <ul className="list-disc pl-6 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                    <li>Resources</li>
                    <li>Software</li>
                    <li>Supervision</li>
                    <li>Validation</li>
                    <li>Visualization</li>
                    <li>Writing – original draft</li>
                    <li>Writing – review and editing</li>
                  </ul>
                </div>
              </section>

              <section id="references">
                <h2 className="text-[22px] font-bold text-[#333] dark:text-white mb-4 pb-2 border-b border-[#DDD] dark:border-[#334155]">References</h2>
                
                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3">References within text</h3>
                <p className="mb-4">Any references cited within your article should also be present in your reference list and vice versa. Some guidelines:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>References cited in your abstract must be given in full.</li>
                  <li>We recommend that you do not include unpublished results and personal communications in your reference list, though you may mention them in the text of your article.</li>
                  <li>Any unpublished results and personal communications included in your reference list must follow the standard reference style of the journal. In substitution of the publication date add "unpublished results" or "personal communication."</li>
                  <li>References cited as "in press" imply that the item has been accepted for publication.</li>
                </ul>
                <p className="mb-4">Linking to cited sources will increase the discoverability of your research. We encourage the use of Digital Object Identifiers (DOIs) as reference links, as they provide a permanent link to the electronic article referenced.</p>
                <p className="mb-4">Before submission, check that all data provided in your reference list are correct, including any references which have been copied. Providing correct reference data allows us to link to abstracting and indexing services such as Scopus, Crossref and PubMed. Any incorrect surnames, journal or book titles, publication years or pagination within your references may prevent link creation.</p>

                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Reference format</h3>
                <p className="mb-4">This journal does not set strict requirements on reference formatting at submission. Some guidelines:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1 text-[#333] dark:text-[#CBD5E1]">
                  <li>References can be in any style or format as long as the style is consistent.</li>
                  <li>Author names, journal or book titles, chapter or article titles, year of publication, volume numbers, article numbers or pagination must be included, where applicable.</li>
                </ul>
                <p className="mb-4">Our journal reference style will be applied to your article after acceptance, at proof stage. If required, at this stage we will ask you to correct or supply any missing reference data.</p>

                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Reference style</h3>
                <p className="mb-4">Citations in the text should follow the referencing style used by the American Psychological Association. You are referred to the Publication Manual of the American Psychological Association, Seventh Edition (2020) ISBN 978-1-4338-3215-4.</p>
                <p className="mb-4">The reference list should be arranged alphabetically and then chronologically. More than one reference from the same author(s) in the same year must be identified by the letters 'a', 'b', 'c', etc., placed after the year of publication.</p>
                
                <p className="font-bold mb-2">Examples:</p>
                <div className="bg-[#F9F9F9] dark:bg-[#1E293B] p-5 rounded border border-[#EBEBEB] dark:border-[#334155] space-y-5">
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a journal publication:</p>
                    <p className="text-[14px]">Van der Geer, J., Handgraaf T., & Lupton, R. A. (2020). The art of writing a scientific article. <em>Journal of Scientific Communications</em>, 163, 51–59. <a href="https://doi.org/10.1016/j.sc.2020.00372" className="text-[#0055A4] dark:text-[#60a5fa] hover:underline break-all">https://doi.org/10.1016/j.sc.2020.00372</a>.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a journal publication with an article number:</p>
                    <p className="text-[14px]">Van der Geer, J., Handgraaf, T., & Lupton, R. A. (2022). The art of writing a scientific article. <em>Heliyon</em>, 19, Article e00205. <a href="https://doi.org/10.1016/j.heliyon.2022.e00205" className="text-[#0055A4] dark:text-[#60a5fa] hover:underline break-all">https://doi.org/10.1016/j.heliyon.2022.e00205</a>.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a book:</p>
                    <p className="text-[14px]">Strunk, W., Jr., & White, E. B. (2000). <em>The elements of style</em> (4th ed.). Longman (Chapter 4).</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a chapter in a book:</p>
                    <p className="text-[14px]">Mettam, G. R., & Adams, L. B. (2020). How to prepare an electronic version of your article. In B. S. Jones, & R. Z. Smith (Eds.), <em>Introduction to the electronic age</em> (pp. 281–304). E-Publishing Inc.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a website:</p>
                    <p className="text-[14px]">Powertech Systems. (2022). Lithium-ion vs lead-acid cost analysis. Retrieved from <a href="http://www.powertechsystems.eu/home/tech-corner/lithium-ion-vs-lead-acid-cost-analysis/" className="text-[#0055A4] dark:text-[#60a5fa] hover:underline break-all">http://www.powertechsystems.eu/home/tech-corner/lithium-ion-vs-lead-acid-cost-analysis/</a>. Accessed January 6, 2022.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a dataset:</p>
                    <p className="text-[14px]">Oguro, M., Imahiro, S., Saito, S., & Nakashizuka, T. (2015). Mortality data for Japanese oak wilt disease and surrounding forest compositions [dataset]. Mendeley Data, v1. <a href="https://doi.org/10.17632/xwj98nb39r.1" className="text-[#0055A4] dark:text-[#60a5fa] hover:underline break-all">https://doi.org/10.17632/xwj98nb39r.1</a>.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to a conference paper or poster presentation:</p>
                    <p className="text-[14px]">Engle, E.K., Cash, T.F., & Jarry, J.L. (2019, November). The Body Image Behaviours Inventory-3: Development and validation of the Body Image Compulsive Actions and Body Image Avoidance Scales. Poster session presentation at the meeting of the Association for Behavioural and Cognitive Therapies, New York, NY.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#666] dark:text-[#94A3B8] mb-1">Reference to software:</p>
                    <p className="text-[14px]">Coon, E., Berndt, M., Jan, A., Svyatsky, D., Atchley, A., Kikinzon, E., Harp, D., Manzini, G., Shelef, E., Lipnikov, K., Garimella, R., Xu, C., Moulton, D., Karra, S., Painter, S., Jafarov, E., & Molins, S. (2020). Advanced Terrestrial Simulator (ATS) (Version 0.88) [Computer software]. Zenodo. <a href="https://doi.org/10.5281/zenodo.3727209" className="text-[#0055A4] dark:text-[#60a5fa] hover:underline break-all">https://doi.org/10.5281/zenodo.3727209</a>.</p>
                  </div>
                </div>

                <h3 className="font-bold text-[18px] text-[#333] dark:text-white mb-3 mt-8">Web references</h3>
                <p className="mb-4">When listing web references, as a minimum you should provide the full URL and the date when the reference was last accessed. Additional information (e.g. DOI, author names, dates or reference to a source publication) should also be provided, if known.</p>
                <p className="mb-4">You can list web references separately under a new heading directly after your reference list or include them in your reference list.</p>
              </section>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
