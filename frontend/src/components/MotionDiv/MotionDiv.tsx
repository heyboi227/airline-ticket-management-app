import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function MotionDiv(props: Readonly<PropsWithChildren>) {
  return (
    <motion.div
      className="row"
      initial={{
        position: "relative",
        top: 20,
        scale: 0.95,
        opacity: 0,
      }}
      animate={{
        top: 0,
        scale: 1,
        opacity: 1,
      }}
      transition={{
        delay: 0.125,
        duration: 0.75,
      }}
    >
      {props.children}
    </motion.div>
  );
}
