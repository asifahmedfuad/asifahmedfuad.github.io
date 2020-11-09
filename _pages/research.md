---
layout: archive
title: "Research"
permalink: /research/
author_profile: true
---

<center>
<a href="https://www.aiub.edu">
  <img src="/images/icons/AIUB_whole_logo.png" alt="AIUB">
</a>
<a href="http://ipcv.eu">
  <img src="/images/icons/ipcv_logo.png" alt="IPCV">
</a>
<a href="http://ppke.hu/en/">
  <img src="/images/icons/PPCU.png" alt="PPCU">
</a>
<a href="http://www.uam.es/">
  <img src="/images/icons/uam.png" alt="UAM">
</a>
<a href="https://www.u-bordeaux.com/">
  <img src="/images/icons/ub.png" alt="UB">
</a>
<a href="https://home.cern/">
  <img src="/images/icons/cern.jpg" alt="CERN">
</a>
<a href="https://www.labri.fr">
  <img src="/images/icons/LABRI_small.png" alt="LaBRI">
</a>
</center>



# Publications


## Journal Publications
  [J4] **Kazi Ahmed Asif Fuad**, Shahriyar Masud Rizvi, “Varying Sample-Width to Realize Area-Efficient FPGA Realization of Sobel-Fieldman Edge Detector”, AIUB Journal of Science and Engineering (AJSE) Vol. 14, No. 1, August 2015 (ISSN: 1608-3679). 
		
  [J3] **Kazi Ahmed Asif Fuad**, Shahriyar Masud Rizvi, “Hardware Software Co-Simulation of Canny Edge Detection Algorithm” International Journal of Computer Applications 122(19): 7-12, July 2015. 
		
  [J2] **Kazi Ahmed Asif Fuad**, Shahriyar Masud Rizvi, “Hardware/Software Co-Simulation of Gradient-based Edge Detectors: A Comparative Study”, STM Journal of Image Processing and Pattern Recognition Progress (JoIPPRP), Vol. 2, No. 3, September, 2015 (ISSN: 2394-1995).
		
  [J1] Md. Maruf Ibne Hasan, **Kazi Ahmed Asif Fuad**, Nipu Rani Barai, Maroof Muhammad Hasan, Shahriyar Masud Rizvi, “FPGA and Microcontroller based Data Acquisition System using Two Wire Serial Communication” Journal of Embedded System and Applications, Vol. 2, No. 3, July 2014. 	 
	
	
	
## Conference Publications
  [C4] **Kazi Ahmed Asif Fuad**, Pierre-Etienne Martin, Romain Giot, Romain Bourqui, Jenny Benois-Pineau, Akka Zemmari  (2020) Features Understanding in 3D CNNs for Actions Recognition in Video. International Conference on Image Processing Theory, Tools and Applications (IPTA) 2020, Paris, France [Accepted]. 
		
  [C3] Mahamud M.S., Islam M., Shila A.S., **Asif Fuad K.A.**, Islam M.R. (2019) Watch IT Version-II: An Assistive Device for Hearing and Speaking Impaired. In: Arai K., Kapoor S., Bhatia R. (eds) Intelligent Systems and Applications. IntelliSys 2018. Advances in Intelligent Systems and Computing, vol 869. Springer, Cham.
		
  [C2] Tasneem Sanjana, **Kazi Ahmed Asif Fuad**, Mehrab Masayeed Habib, Ahmed Amin Rumel, "Automated anti-collision system for automobiles" 2017 International Conference on Electrical, Computer and Communication Engineering (ECCE), Cox's Bazar, 2017, pp. 866-870. 
		
  [C1] **Kazi Ahmed Asif Fuad**, Md. Maruf Ibne Hasan, Laila Nawsheen Manzoor, Mohammad Abdul Mannan, Chowdhury Akram Hossain, "Design and simulation of centralized load controlled automated power system network (CLCAPSN)" 2015 IEEE International WIE Conference on Electrical and Computer Engineering\ (WIECON-ECE), Dhaka, 2015, pp. 61-64. 
		

# Projects


Master Thesis Topic: **Recognition of Sports Gestures with 3D Deep CNNs: Explanation of Networks** 

Supervised by: [Professor Jenny Benois-Pineau](https://www.labri.fr/projet/AIV/jennybenoispineauen.php "Profile").
<center>
  <img src="/images/projects/ipcv_thesis.png" alt="IPCV_thesis">
</center>

*Abstract*:  Human Action Recognition is one of the key tasks in video understanding. Deep Convolutional Neural Networks (CNN) are often used to tackle this issue. Although they usually perform
impressively for such action classification tasks, their interpretability remains challenging. During the last decade, various analytical visualization techniques such as Vanilla gradient-based
Backpropagation or Grad-CAM help understanding features, from input space, that strongly supports the final decision and further network optimization.

In this thesis, we propose a novel visual features understanding technique for 3DCNNs for action recognition. Its objective is to find salient features that played a key role in decision
making of the network. Our proposed visualization technique takes the features from the last Convolutional layer before the fully connected layers of a trained model and generates a binary
feature importance map per channel. To reduce the contribution of relatively low magnitude features, the final importance map is generated as a weighted sum of all binary channel maps.
Finally, the resulting importance map is propagated to the original frame thus “explaining” the regions in them that contribute to the final decision. The method is fast and does not require
gradient computation.

Our proposed technique is applied to the Twin Spatio-Temporal Convolutional Neural Network (TSTCNN) we designed for Table Tennis Action recognition task that was trained on our dataset
TTStroke-21. Feature visualization is performed at the RGB and Optical flow branches of thenetwork. Obtained results are compared to other visualization techniques both in terms of human
understanding and similarity metrics between importance maps generated by different methods: Vanilla gradient–based Backpropagation, Guided Backpropagation and Grad-CAM. The metrics
show that generated maps are similar to those obtained with known Grad-CAM method, e.g. Pearson Correlation Coefficient between the maps generated of RGB data for Grad-Cam and our
method is 0.7 ± 0.05 and 0.72 ± 0.06 on Optical Flow data. Visualization methods have been applied to RGB Spatio-Temporal Convolutional Neural Network (RGBSTCNN) and Optical
Flow Spatio-Temporal Convolutional Neural Network (OFTSTCNN) to observe whether models with similar architecture trained on the same dataset learn similar kind of knowledge. Comparing
all the models, it is observed that Our algorithm is similar to Grad-CAM and Guided GradCAM analytically. Finally, proposed method was applied to existing popular CNN architecture
AlexNet and VGG-16 and satisfactory results are obtained. Computationally, the proposed algorithm is twice faster. Hence, this simple computationally inexpensive visualization
technique is similar to Grad-CAM but does not require heavy gradient computation.

Master Thesis Topic: **Area-Efficient FPGA realization of Edge Detectors by varying sample-widths and gradient operators and utilizing Software-Hardware Co-Design.** 

Supervised by: Associate Professor Shahriyar Masud Rizvi.

<center>
  <img src="/images/projects/msc_thesis.png" alt="msc_thesis">
</center>
*Abstract*: This thesis presents a comprehensive comparative study of edge detection techniques and proposes a ovel area-efficient edge detection method for gradient based edge detector such as Sobel-Fieldman
algorithm by manipulating input sample widths and, in case of Canny edge detector, manipulating gradient operators. After varying sample-widths we find that some smaller sample widths generate images
of a quality that is identical to ones attained from standard sample-width (16:14) but with sufficiently lesser FPGA resources. The sample-width of (6:4) generates images of quality attained in standard
sample-size of (16:14) with 27% lesser no of LUTs, 25% lesser no of registers and overall 21% lesser slices. We also varied gradient operators used in Canny edge detection algorithm and found Canny
algorithm with Robert operator to be the most area-efficient realization while Canny algorithm with Robinson compass operator is found to be more effective edge detector than traditional Canny edge
detector with Sobel-Fieldman operator (the former can detect more edges than any other operator used). All the algorithms were simulated in MATLAB and OpenCV for software realization and later they were
realized in hardware Spartan-6 LX16 FPGAs from Xilinx utilizing Simulink (from Mathworks) and System Generator (XSG) (From Xilinx).
  
Bachelor Thesis Topic: **Design and Implementation of Centralized Load Controlled Automated Power System Network (CLCAPSN)** 

Supervised by: Ms. Laila Nawsheen Manzoor.
<center>
  <img src="/images/projects/bsc_thesis.png" alt="msc_thesis">
</center>
*Abstract*: We are living in the age where technology is not the major attraction, what level of smart and intelligent the technology is. Power system network is advancing up its way along the smart grid but load end
information can make system more efficient. In our project & thesis, we have tried to implement a power system wirelessly connected to the load end side for data transfer about load status.
In our project we have tried to bring out the fact “Power Crisis” can be minimized and “Power utilization” can be optimized through monitoring it. To do this we combined embedded system with power circuits.
Embedded system has the ability to control a system with high efficiency interfacing the system with digital system as anything interfaced with digital system can be modeled or monitored by “Artificial
Intelligence”.
User load nature throughout a particular time let the system predict about future and allows the power administrators to design the system and maintain it efficiently. Pre-paid billing makes sure profit
alongside making mental awareness not to waste power.