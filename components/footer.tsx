export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Returns
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Press
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect with Us</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#" className="hover:opacity-100">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2025 MilkBox. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
