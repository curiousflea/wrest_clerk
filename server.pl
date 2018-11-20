#!/usr/bin/env perl
use v5.26;
use strict;
use warnings;
use HTTP::Daemon;
use HTTP::Status;

my $d = HTTP::Daemon->new(
	LocalAddr => '192.168.15.65',
	LocalPort => 8080,
	ReuseAddr => 1,
	ReusePort => 1,
	Listen    => 10,
) || die "$!";

printf "Server started (PID $$): <URL:%s>\n", $d->url;
while (my $c = $d->accept) {

	my $pid = fork;
	die "Unable to fork: $!" unless defined $pid;
	if ($pid) {
		$c->close;
		undef($c);
		next;
	}

	print  "Starting child (PID $$)\n";
	printf "Accept connection from %s:%s\n", $c->peerhost, $c->peerport;

	while (my $r = $c->get_request) {
		printf "PID $$: %s\n", $r->method;
		if ($r->method eq 'GET') {
			printf "PID $$: \t%s\n", $r->uri->path;

			if ($r->uri->path =~ m|\A/\z|) {
				my $file = "html/index.html";
				$c->send_file_response($file);

			} elsif ($r->uri->path =~ m|\A/.+\.html\z|) {
				my $file = 'html' . $r->uri->path;
				$c->send_file_response($file);

			} elsif ($r->uri->path =~ m|\A/css/.+\.css\z|) {
				my $file = '.' . $r->uri->path;
				$c->send_file_response($file);

			} elsif ($r->uri->path =~ m|\A/js/.+\.js\z|) {
				my $file = '.' . $r->uri->path;
				$c->send_file_response($file);

			} elsif ($r->uri->path =~ m|\A/fr_.+\.html\z|) {
				my $file = '.' . $r->uri->path;
				$c->send_file_response($file);

				#	} elsif ($r->uri->path eq "/help") {
				#		$c->send_response(HTTP::Response->new(
				#			RC_OK, 'XEP', HTTP::Headers->new(
				#				'Server'       => 'Simple',
				#				'Date'         => time,
				#				'Content-Type' => 'text/html',
				#				'Content-Base' => 'http://www.perl.org/',
				#			),
				#			undef,
				#		));
			} else {
				$c->send_error(RC_FORBIDDEN);
				print "PID $$: \tFORBIDDEN\n";
			}
			print "PID $$: GET PROCESSED\n";
		} else {
			$c->send_error(RC_FORBIDDEN);
		}
	}
	$c->close;
	undef($c);
	print "Exiting from child (PID $$)\n";
	exit;
}
