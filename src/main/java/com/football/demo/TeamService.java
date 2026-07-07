package com.football.demo;

import com.football.demo.dto.TeamRequest;
import com.football.demo.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeamService {

    private final TeamRepository repository;

    public TeamService(TeamRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Team> getAllTeams() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Team> searchTeams(String name, String city) {
        if (name != null && !name.isBlank()) {
            return repository.findByNameContainingIgnoreCase(name.trim());
        }
        if (city != null && !city.isBlank()) {
            return repository.findByCityContainingIgnoreCase(city.trim());
        }
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Team getTeamById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + id));
    }

    public Team createTeam(TeamRequest request) {
        Team team = new Team();
        applyRequest(team, request);
        return repository.save(team);
    }

    public Team updateTeam(Long id, TeamRequest request) {
        Team team = getTeamById(id);
        applyRequest(team, request);
        return repository.save(team);
    }

    public void deleteTeam(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Team not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private void applyRequest(Team team, TeamRequest request) {
        team.setName(request.getName());
        team.setCity(request.getCity());
        team.setStadium(request.getStadium());
        team.setFoundedYear(request.getFoundedYear());
    }
}
