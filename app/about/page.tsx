export default function About() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-custom mb-8 text-center">
            About MyTownhall
          </h1>
          
          <div className="space-y-16">
            {/* Mission Section */}
            <section className="animate-slide-up">
              <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                <h2 className="text-2xl font-bold text-primary mb-6 uppercase tracking-wider">
                  Our Mission
                </h2>
                <p className="text-lg text-primary-custom/80 leading-relaxed mb-6">
                  MyTownhall was created to bridge the gap between local government and citizens. 
                  We believe that democracy works best when people are informed, engaged, and 
                  have easy access to the information they need to make informed decisions.
                </p>
                <p className="text-lg text-primary-custom/80 leading-relaxed">
                  Our platform transforms complex government data into accessible, interactive 
                  formats that help communities understand how their local government operates 
                  and how they can get involved.
                </p>
              </div>
            </section>

            {/* What We Provide Section */}
            <section className="animate-slide-up">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-primary mb-6 uppercase tracking-wider">
                    What MyTownhall Provides
                  </h2>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-primary-custom">Budget Transparency</h3>
                        <p className="text-primary-custom/70">Interactive visualizations of municipal spending and revenue</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-primary-custom">Meeting Access</h3>
                        <p className="text-primary-custom/70">Easy access to agendas, minutes, and upcoming meetings</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-primary-custom">Community Forum</h3>
                        <p className="text-primary-custom/70">Platform for My discussion and community engagement</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-primary-custom">Interactive Maps</h3>
                        <p className="text-primary-custom/70">Visual representation of municipal boundaries and services</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-primary text-primary-foreground rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
                    Our Impact
                  </h2>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">85%</div>
                      <div className="text-primary-foreground/80">Increase in My engagement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">12</div>
                      <div className="text-primary-foreground/80">Municipalities served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">2.5k</div>
                      <div className="text-primary-foreground/80">Active community members</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What's Next Section */}
            <section className="animate-slide-up">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl shadow-lg p-8 md:p-12 text-center">
                <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider">
                  What's Next
                </h2>
                <p className="text-lg leading-relaxed mb-6">
                  We're constantly expanding to serve more communities across the nation. 
                  Our roadmap includes mobile applications, real-time notifications, 
                  multilingual support, and enhanced data visualization tools.
                </p>
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm">Coming Soon: 50+ New Municipalities</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}