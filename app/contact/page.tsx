'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-4">
            Let's 
            <span className="font-medium text-emerald-600"> Connect</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Questions about MyTownhall? Ready to bring transparency to your community? 
            We're here to help.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="group flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">Email Us</h3>
                  <p className="text-slate-600">hello@MyTownhall.org</p>
                  <p className="text-sm text-slate-500 mt-1">Response within 24 hours</p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-slate-200 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">Call Us</h3>
                  <p className="text-slate-600">(555) 123-4567</p>
                  <p className="text-sm text-slate-500 mt-1">Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">Visit Us</h3>
                  <p className="text-slate-600">
                    123 Democracy Street<br />
                    My Center, DC 20001
                  </p>
                </div>
              </div>
            </div>

            {/* For Municipalities Card */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <h3 className="font-semibold mb-3 text-xl">For Municipalities</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Ready to transform your community with transparent governance? Let's discuss how MyTownhall can help.
                </p>
                <button className="inline-flex items-center gap-2 text-emerald-400 font-medium group-hover:gap-3 transition-all duration-300">
                  <span>Schedule consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
              
              {isSubmitted ? (
                <div className="text-center py-20 animate-fadeIn">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-medium text-slate-900 mb-3">Message sent successfully!</h3>
                  <p className="text-slate-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-medium text-slate-900 mb-8">Send us a message</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="group">
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all duration-200"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all duration-200 resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}