CREATE TABLE `units` (
  `code` varchar(8) NOT NULL,
  `desc` varchar(100) NOT NULL,
  `cp` float(3) NOT NULL,
  `type` varchar(40) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

INSERT INTO `units` (`code`, `desc`, `cp`, `type`) VALUES
('ICT10001', 'Problem Solving with ICT', 12.5, 'Core'),
('COS10005', 'Web Development', 12.5, 'Core'),
('INF10002', 'Database Analysis and Design', 12.5, 'Core'),
('COS10009', 'Introduction to Programming', 12.5, 'Core'),
('COS20001', 'User-Centred Design', 12.5, 'Software Development'),
('TNE10005', 'Network Administration', 12.5, 'Software Development'),
('COS20016', 'Operating System Configuration', 12.5, 'Software Development'),
('INF20012', 'Enterprise Systems', 12.5, 'Systems Analysis'),
('ACC10007', 'Financial Information for Decision Making', 12.5, 'Systems Analysis'),
('INF20003', 'Requirements Analysis and Modelling', 12.5, 'Systems Analysis'),
('ACC20014', 'Management Decision Making', 12.5, 'Systems Analysis'),
('INF30001', 'Systems Acquisition & Implementation Management', 12.5, 'Systems Analysis');

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', 'hellovue');
