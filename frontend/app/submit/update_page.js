const fs = require('fs'); 
let content = fs.readFileSync('frontend/app/submit/page.tsx', 'utf8'); 
const topPart = content.split('    return (')[0]; 
const newJSX = `    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[var(--white)] font-sans">
            <Navbar />

            <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar */}
                    <div className="lg:w-[320px] shrink-0">
                        <div className="sticky top-24 space-y-6">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-[#19344f] dark:text-white mb-2 tracking-tight">Submit Your Paper</h1>
                                <p className="text-[#64748B] dark:text-[#94A3B8] text-sm leading-relaxed">
                                    Fill in the details below to submit your paper for review and publication.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-[var(--paper)] border border-[#E2E8F0] dark:border-[var(--border)] rounded-xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#EEF2FF] dark:bg-[#1E293B] p-2 rounded-lg">
                                        <FileText className="w-5 h-5 text-[#4F46E5] dark:text-[#818CF8]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Guidelines</h3>
                                        <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                                            Ensure your paper follows our publication guidelines and format requirements.
                                        </p>
                                        <a href="/publish-guidelines" target="_blank" className="text-[13px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1">
                                            View Guidelines &rarr;
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[var(--paper)] border border-[#E2E8F0] dark:border-[var(--border)] rounded-xl p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-[#F0FDF4] dark:bg-[#14532D]/30 p-2 rounded-lg">
                                        <Info className="w-5 h-5 text-[#16A34A] dark:text-[#4ADE80]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1">Need Help?</h3>
                                        <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-3">
                                            If you have any questions, please contact our support team.
                                        </p>
                                        <a href="/contact" target="_blank" className="text-[13px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1">
                                            Contact Us &rarr;
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Step Tracker */}
                            <div className="bg-white dark:bg-[var(--paper)] border border-[#E2E8F0] dark:border-[var(--border)] rounded-xl p-6 shadow-sm hidden lg:block">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#2563EB]">Paper Details</div>
                                            <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Enter your paper information</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] dark:bg-[var(--sand)] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[var(--border)] flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#1E293B] dark:text-white">Authors</div>
                                            <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Add all authors and their details</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] dark:bg-[var(--sand)] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[var(--border)] flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#1E293B] dark:text-white">Upload Files</div>
                                            <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Upload your manuscript and files</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] dark:bg-[var(--sand)] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[var(--border)] flex items-center justify-center font-bold text-sm shrink-0">4</div>
                                        <div>
                                            <div className="text-[14px] font-bold text-[#1E293B] dark:text-white">Review & Submit</div>
                                            <div className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Review your information and submit</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Section 1: Paper Details */}
                            <div className="bg-white dark:bg-[var(--paper)] rounded-xl border border-[#E2E8F0] dark:border-[var(--border)] shadow-sm overflow-hidden">
                                <div className="border-b border-[#E2E8F0] dark:border-[var(--border)] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">1. Paper Details</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Provide the basic information about your paper.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Corresponding Author Email <span className="text-red-500">*</span></label>
                                            <input 
                                                {...register('correspondingEmail')} 
                                                className="w-full h-10 px-3 py-2 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow"
                                                placeholder="Enter corresponding author email"
                                            />
                                            {errors.correspondingEmail && <p className="text-red-500 text-xs mt-1.5">{errors.correspondingEmail.message}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Paper Title <span className="text-red-500">*</span></label>
                                            <input 
                                                {...register('title')} 
                                                className="w-full h-10 px-3 py-2 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow"
                                                placeholder="Enter the title of your paper"
                                            />
                                            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Abstract <span className="text-red-500">*</span></label>
                                        <textarea 
                                            {...register('abstract')} 
                                            className="w-full min-h-[120px] px-3 py-3 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow resize-y"
                                            placeholder="Enter your paper abstract..."
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.abstract ? <p className="text-red-500 text-xs">{errors.abstract.message}</p> : <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8]">A brief summary of your paper</p>}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Highlights (Key Points) <span className="text-red-500">*</span></label>
                                        <textarea 
                                            {...register('highlights')} 
                                            className="w-full min-h-[100px] px-3 py-3 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow resize-y"
                                            placeholder="Enter the key highlights of your paper..."
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.highlights ? <p className="text-red-500 text-xs">{errors.highlights.message}</p> : <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8]">Summarize the main contributions</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Keywords <span className="text-red-500">*</span></label>
                                        <input 
                                            {...register('keywordsStr')} 
                                            className="w-full h-10 px-3 py-2 border border-[#CBD5E1] dark:border-[var(--border)] bg-white dark:bg-[var(--sand)] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] dark:text-white transition-shadow"
                                            placeholder="e.g. machine learning, data mining, artificial intelligence"
                                        />
                                        <div className="flex justify-between items-center mt-1.5">
                                            {errors.keywordsStr ? <p className="text-red-500 text-xs">{errors.keywordsStr.message}</p> : <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8]">Minimum 6 keywords, separated by commas</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[13px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Subject Area / Category <span className="text-red-500">*</span></label>
                                            <select 
                                                {...register('subject')} 
                                                className="w-full h-10 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] bg-white dark:bg-transparent dark:text-white"
                                            >
                                                <option value="" className="text-gray-500 dark:bg-[var(--paper)]">Select subject area</option>
                                                {(Array.isArray(subjectsData) ? subjectsData : (subjectsData as any)?.data || []).map((s: any) => (
                                                    <option key={s._id} value={s._id} className="dark:bg-[var(--paper)]">{s.name}</option>
                                                ))}
                                            </select>
                                            {errors.subject && <p className="text-red-500 text-xs mt-1.5">{errors.subject.message}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Authors */}
                            <div className="bg-white dark:bg-[var(--paper)] rounded-xl border border-[#E2E8F0] dark:border-[var(--border)] shadow-sm overflow-hidden">
                                <div className="border-b border-[#E2E8F0] dark:border-[var(--border)] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">2. Authors</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Add all authors who contributed to this paper.</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => append({ name: '', email: '', contact: '', address: '', designation: '' })}
                                        className="flex items-center gap-1.5 bg-white dark:bg-[var(--sand)] hover:bg-gray-50 dark:hover:bg-[#333] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#60A5FA]/20 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Add Author
                                    </button>
                                </div>
                                <div className="p-6 space-y-6">
                                    {fields.map((item, index) => (
                                        <div key={item.id} className="relative bg-[#F8FAFC] dark:bg-[var(--sand)] border border-[#E2E8F0] dark:border-[var(--border-light)] rounded-xl overflow-hidden">
                                            <div className="bg-[#F1F5F9] dark:bg-[#333]/50 border-b border-[#E2E8F0] dark:border-[var(--border-light)] px-4 py-2.5 flex items-center justify-between">
                                                <div className="text-[13px] font-bold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-2">
                                                    <span className="opacity-50">&#8226;&#8226;&#8226;</span> Author {index + 1}
                                                </div>
                                                {index > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => remove(index)}
                                                        className="text-red-500 hover:text-red-600 p-1"
                                                        title="Remove Author"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`authors.${index}.name\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                        placeholder="e.g. Dr. John Doe"
                                                    />
                                                    {errors.authors?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.name?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Email <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`authors.${index}.email\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                        placeholder="Enter email address"
                                                    />
                                                    {errors.authors?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.email?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`authors.${index}.contact\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                        placeholder="Enter contact number"
                                                    />
                                                    {errors.authors?.[index]?.contact && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.contact?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Designation <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`authors.${index}.designation\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                        placeholder="Enter designation"
                                                    />
                                                    {errors.authors?.[index]?.designation && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.designation?.message}</p>}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Postal Address <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`authors.${index}.address\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                        placeholder="Enter complete postal address"
                                                    />
                                                    {errors.authors?.[index]?.address && <p className="text-red-500 text-xs mt-1">{errors.authors[index]?.address?.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 2.5: Reviewers */}
                            <div className="bg-white dark:bg-[var(--paper)] rounded-xl border border-[#E2E8F0] dark:border-[var(--border)] shadow-sm overflow-hidden">
                                <div className="border-b border-[#E2E8F0] dark:border-[var(--border)] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20 flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">Suggested Reviewers</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">List of suggested reviewers (Min 1 - Max 5)</p>
                                        </div>
                                    </div>
                                    {reviewerFields.length < 5 && (
                                        <button 
                                            type="button" 
                                            onClick={() => appendReviewer({ name: '', designation: '', affiliation: '', email: '', contact: '', researchArea: '' })}
                                            className="flex items-center gap-1.5 bg-white dark:bg-[var(--sand)] hover:bg-gray-50 dark:hover:bg-[#333] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#60A5FA]/20 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors"
                                        >
                                            <Plus className="w-4 h-4" /> Add Reviewer
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 space-y-6">
                                    {reviewerFields.map((item, index) => (
                                        <div key={item.id} className="relative bg-[#F8FAFC] dark:bg-[var(--sand)] border border-[#E2E8F0] dark:border-[var(--border-light)] rounded-xl overflow-hidden">
                                            <div className="bg-[#F1F5F9] dark:bg-[#333]/50 border-b border-[#E2E8F0] dark:border-[var(--border-light)] px-4 py-2.5 flex items-center justify-between">
                                                <div className="text-[13px] font-bold text-[#1E293B] dark:text-[#E2E8F0] flex items-center gap-2">
                                                    <span className="opacity-50">&#8226;&#8226;&#8226;</span> Reviewer {index + 1}
                                                </div>
                                                {index > 0 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeReviewer(index)}
                                                        className="text-red-500 hover:text-red-600 p-1"
                                                        title="Remove Reviewer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    </button>
                                                )}
                                            </div>
                                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Full Name <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`reviewers.${index}.name\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.name && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.name?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Email <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`reviewers.${index}.email\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.email && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.email?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Designation <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`reviewers.${index}.designation\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.designation && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.designation?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Affiliation <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`reviewers.${index}.affiliation\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.affiliation && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.affiliation?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Contact Number <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`reviewers.${index}.contact\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.contact && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.contact?.message}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[12.5px] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-1.5">Research Area <span className="text-red-500">*</span></label>
                                                    <input 
                                                        {...register(\`reviewers.${index}.researchArea\` as const)} 
                                                        className="w-full h-9 px-3 border border-[#CBD5E1] dark:border-[var(--border)] rounded-md text-[13px] focus:outline-none focus:border-[#2563EB] bg-white dark:bg-[var(--paper)] dark:text-white"
                                                    />
                                                    {errors.reviewers?.[index]?.researchArea && <p className="text-red-500 text-xs mt-1">{errors.reviewers[index]?.researchArea?.message}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {errors.reviewers?.root && <p className="text-red-500 text-sm mt-2">{errors.reviewers.root.message}</p>}
                                </div>
                            </div>

                            {/* Section 3: Upload Files */}
                            <div className="bg-white dark:bg-[var(--paper)] rounded-xl border border-[#E2E8F0] dark:border-[var(--border)] shadow-sm overflow-hidden">
                                <div className="border-b border-[#E2E8F0] dark:border-[var(--border)] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <UploadCloud className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">3. Upload Files</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Upload your manuscript and any supporting files.</p>
                                        </div>
                                    </div>
                                    <div className="text-[12px] text-[#64748B] flex items-center gap-1 cursor-help">
                                        What to upload? <Info className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    {!editId && (
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-[13.5px] font-bold text-[#1E293B] dark:text-white mb-2">Manuscript Document <span className="text-red-500">*</span></h3>
                                                <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border-2 border-[#E2E8F0] dark:border-[var(--border)] border-dashed rounded-xl cursor-pointer bg-[#F8FAFC] dark:bg-[var(--sand)] hover:bg-[#F1F5F9] dark:hover:bg-[#333] transition-colors">
                                                    <Upload className="w-8 h-8 text-[#2563EB] mb-3" />
                                                    <span className="text-[14px] font-bold text-[#1E293B] dark:text-white mb-1">
                                                        {file ? 'File Selected' : 'Drag & drop your files here'}
                                                    </span>
                                                    <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-4">or</span>
                                                    <div className="bg-[#2563EB] text-white text-[13px] font-bold px-5 py-2 rounded-lg">
                                                        {file ? 'Change File' : 'Choose Files'}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setFile(e.target.files[0]);
                                                                setFileError('');
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8] mt-4 text-center">
                                                        Accepted formats: PDF, DOC, DOCX<br/>Maximum file size: 5MB per file
                                                    </p>
                                                </label>
                                                {file && <p className="text-[#16A34A] text-xs mt-2 font-medium">Attached: {file.name}</p>}
                                                {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
                                            </div>

                                            <div>
                                                <h3 className="text-[13.5px] font-bold text-[#1E293B] dark:text-white mb-2">Cover Letter <span className="text-red-500">*</span></h3>
                                                <label className="relative flex flex-col items-center justify-center w-full min-h-[140px] px-4 py-6 border-2 border-[#E2E8F0] dark:border-[var(--border)] border-dashed rounded-xl cursor-pointer bg-[#F8FAFC] dark:bg-[var(--sand)] hover:bg-[#F1F5F9] dark:hover:bg-[#333] transition-colors">
                                                    <Upload className="w-8 h-8 text-[#2563EB] mb-3" />
                                                    <span className="text-[14px] font-bold text-[#1E293B] dark:text-white mb-1">
                                                        {coverLetterFile ? 'Cover Letter Selected' : 'Drag & drop your cover letter'}
                                                    </span>
                                                    <span className="text-[12px] text-[#64748B] dark:text-[#94A3B8] mb-4">or</span>
                                                    <div className="bg-[#2563EB] text-white text-[13px] font-bold px-5 py-2 rounded-lg">
                                                        {coverLetterFile ? 'Change File' : 'Choose Files'}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        className="hidden"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                setCoverLetterFile(e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                    <p className="text-[11.5px] text-[#64748B] dark:text-[#94A3B8] mt-4 text-center">
                                                        Accepted formats: DOC, DOCX
                                                    </p>
                                                </label>
                                                {coverLetterFile && <p className="text-[#16A34A] text-xs mt-2 font-medium">Attached: {coverLetterFile.name}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 4: Review & Submit */}
                            <div className="bg-white dark:bg-[var(--paper)] rounded-xl border border-[#E2E8F0] dark:border-[var(--border)] shadow-sm overflow-hidden">
                                <div className="border-b border-[#E2E8F0] dark:border-[var(--border)] p-6 bg-[#FAFAF9] dark:bg-[#1E293B]/20">
                                    <div className="flex items-center gap-3">
                                        <CheckSquare className="w-6 h-6 text-[#2563EB]" />
                                        <div>
                                            <h2 className="text-[18px] font-bold text-[#1E293B] dark:text-[#F8FAFC]">4. Review & Submit</h2>
                                            <p className="text-[13px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">Please review your information before submitting.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="bg-[#EFF6FF] dark:bg-[#1E3A8A]/20 border border-[#BFDBFE] dark:border-[#1E3A8A] rounded-lg p-4 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-[#3B82F6] shrink-0 mt-0.5" />
                                        <p className="text-[13px] text-[#1E3A8A] dark:text-[#BFDBFE] leading-relaxed">
                                            Please ensure all details are accurate. You can go back and edit if needed before making the final submission.
                                        </p>
                                    </div>

                                    <div>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center mt-0.5">
                                                <input 
                                                    type="checkbox" 
                                                    {...register('declaration')} 
                                                    className="peer appearance-none w-5 h-5 border-2 border-[#CBD5E1] dark:border-[var(--border)] rounded bg-white dark:bg-[var(--sand)] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer"
                                                />
                                                <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </div>
                                            <div className="text-[13.5px] text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                                                I confirm that this paper is original, has not been published elsewhere, and all authors agree to this submission. I have read and accept the <a href="/declaration" target="_blank" className="text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold">Submission Declaration</a>.
                                            </div>
                                        </label>
                                        {errors.declaration && <p className="text-red-500 text-xs mt-2 pl-8">{errors.declaration.message}</p>}
                                    </div>

                                    {submitError && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm font-medium border border-red-200 dark:border-red-900/50">{submitError}</div>}

                                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <button 
                                            type="button"
                                            className="w-full sm:w-auto px-6 py-2.5 bg-white dark:bg-[var(--paper)] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[var(--border)] rounded-lg text-[14px] font-bold hover:bg-[#F8FAFC] dark:hover:bg-[#333] transition-colors"
                                        >
                                            Save as Draft
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting} 
                                            className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-2.5 rounded-lg text-[14px] font-bold transition-colors shadow-md shadow-[#2563EB]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            {editId ? 'Save Changes' : 'Review & Submit Paper'}
                                            {!isSubmitting && !editId && <span className="text-lg leading-none mb-0.5">&rarr;</span>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
            
            <div className="py-6 text-center text-[12px] text-[#94A3B8] border-t border-[#E2E8F0] dark:border-[var(--border)] mt-8">
                <div className="flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Your information is secure and will only be used for the review and publication process.
                </div>
            </div>
            
        </div>
    );
}
`; 
fs.writeFileSync('frontend/app/submit/page.tsx', topPart + newJSX);
console.log('Done replacement');
