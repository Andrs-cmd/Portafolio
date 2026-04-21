import { motion } from "framer-motion"

const links = ["Home", "Projects", "About", "Contact"]

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -50, x: "-50%", opacity: 0 }}
      animate={{ y: 0, x: "-50%", opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-12 left-1/2 z-[100] w-max"
    >
      
        

       
    </motion.nav>
  )
}

export default Navbar